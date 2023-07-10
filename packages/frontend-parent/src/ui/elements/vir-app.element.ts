import {randomString} from '@augment-vir/browser';
import {
    ChildFrameMessageTypeEnum,
    myIframeMessenger,
    ports,
} from '@electrovir/iframe-pen-test-common';
import {css, defineElementNoInputs, html, listen} from 'element-vir';
import localForage from 'localforage-esm';

const secretCodeStorageKey = 'secret-code';

const childOrigin = `http://localhost:${ports.child}`;

export const VirApp = defineElementNoInputs({
    tagName: 'vir-app',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            font-family: sans-serif;
            padding: 32px;
            align-items: center;
        }

        button {
            padding: 8px;
        }

        .tip {
            opacity: 0.8;
            font-size: 0.7em;
        }
    `,
    stateInitStatic: {
        secretCode: randomString(32),
    },
    renderCallback({state, updateState, host}) {
        localStorage.setItem(secretCodeStorageKey, state.secretCode);
        sessionStorage.setItem(secretCodeStorageKey, state.secretCode);
        localForage.setItem(secretCodeStorageKey, state.secretCode);
        document.cookie = `${secretCodeStorageKey}=${state.secretCode}`;

        setTimeout(async () => {
            const childIframe = host.shadowRoot.querySelector('iframe');
            if (!(childIframe instanceof HTMLElement)) {
                throw new Error('failed to find child iframe');
            }
            await myIframeMessenger.sendMessageToChild({
                iframeElement: childIframe,
                childOrigin,
                message: {
                    type: ChildFrameMessageTypeEnum.SendDataToChild,
                    data: `not secret ${randomString(4)}`,
                },
            });

            const childData = await myIframeMessenger.sendMessageToChild({
                iframeElement: childIframe,
                childOrigin,
                message: {
                    type: ChildFrameMessageTypeEnum.RequestDataFromChild,
                },
                verifyChildData(data) {
                    return typeof data === 'string';
                },
            });

            if (!childData) {
                throw new Error('got no data from child');
            }
        }, 200);

        return html`
            <p>
                Current secret code:
                <span class="parent-secret-code">${state.secretCode}</span>
            </p>
            <p>
                <button
                    ${listen('click', () => {
                        updateState({secretCode: randomString(32)});
                    })}
                >
                    Generate New Secret
                </button>
            </p>
            <iframe src=${childOrigin}></iframe>
            <p class="tip">
                If the iframe is empty, wait for all dev servers to startup and then refresh the
                page.
            </p>
        `;
    },
});
