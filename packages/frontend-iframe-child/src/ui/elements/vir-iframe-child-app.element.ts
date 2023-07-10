// pen-test: modify only this file

import {mapObjectValues, wrapInTry} from '@augment-vir/common';
import {
    ChildFrameMessageTypeEnum,
    myIframeMessenger,
    ports,
} from '@electrovir/iframe-pen-test-common';
import {css, defineElementNoInputs, html} from 'element-vir';

export const VirIframeChildApp = defineElementNoInputs({
    tagName: 'vir-iframe-child-app',
    styles: css`
        :host {
            width: 100%;
            height: 100%;
            font-family: sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            flex-direction: column;
        }

        p {
            margin: 4px;
        }

        .background {
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: -1;
            opacity: 0.3;
            background: linear-gradient(
                135deg,
                hsl(0, 100%, 50%),
                hsl(30, 100%, 50%),
                hsl(60, 100%, 50%),
                hsl(90, 100%, 50%),
                hsl(120, 100%, 50%),
                hsl(150, 100%, 50%),
                hsl(180, 100%, 50%),
                hsl(210, 100%, 50%),
                hsl(240, 100%, 50%),
                hsl(270, 100%, 50%),
                hsl(300, 100%, 50%),
                hsl(330, 100%, 50%),
                hsl(360, 100%, 50%)
            );
        }
    `,
    stateInitStatic: {
        receivedMessage: '',
    },
    initCallback({updateState, host}) {
        myIframeMessenger.listenForParentMessages({
            parentOrigin: `http://127.0.0.1:${ports.parent}`,
            listener: (message) => {
                if (message.type === ChildFrameMessageTypeEnum.RequestDataFromChild) {
                    return 'hello';
                } else if (message.type === ChildFrameMessageTypeEnum.SendDataToChild) {
                    updateState({receivedMessage: message.data});
                    return undefined;
                } else {
                    throw new Error(
                        /**
                         * Any cast needed because TS knows the .type is fully covered already, but
                         * we want to cover the edge case where it somehow isn't.
                         */
                        `Child iframe got unexpected message type: '${(message as any).type}'`,
                    );
                }
            },
        });
        async function grabExternalSecretCode() {
            const thingsToTry = {
                cookies: () => document.cookie.split('=')[1]!,
                localStorage: () => localStorage.getItem('secret-code')!,
                sessionStorage: () => sessionStorage.getItem('secret-code')!,
                parentDom: () =>
                    (
                        parent.document.body
                            .querySelector('vir-app')!
                            .shadowRoot!.querySelector('.parent-secret-code') as HTMLElement
                    ).innerText!,
                parentLocalStorage: () => parent.localStorage.getItem('secret-code')!,
                parentSessionStorage: () => parent.sessionStorage.getItem('secret-code')!,
                top: () =>
                    (
                        top!.document.body
                            .querySelector('vir-app')!
                            .shadowRoot!.querySelector('.parent-secret-code') as HTMLElement
                    ).innerText!,
                // pen-test: add more things to try in here
            };

            const attempts = mapObjectValues(thingsToTry, (key, callback) => {
                const value: string = wrapInTry({
                    callback() {
                        return callback() || '';
                    },
                    fallbackValue: '',
                });

                return value;
            });

            const secretCodeFromParent = Object.values(attempts).find((attempt) => !!attempt) ?? '';

            return secretCodeFromParent;
        }

        setTimeout(() => {
            grabExternalSecretCode().then((secretCode) => {
                const secretCodeSpan = host.shadowRoot.querySelector('.secret-code');

                if (!(secretCodeSpan instanceof HTMLSpanElement)) {
                    throw new Error('failed to find secret code child span element');
                }

                secretCodeSpan.innerHTML = secretCode || 'unknown';
            });
        }, 1000);
    },
    renderCallback({state}) {
        return html`
            <div class="background"></div>
            <p>child iframe</p>
            <p>received message: ${state.receivedMessage}</p>
            <p>
                secret code is:
                <span class="secret-code"></span>
            </p>
        `;
    },
});
