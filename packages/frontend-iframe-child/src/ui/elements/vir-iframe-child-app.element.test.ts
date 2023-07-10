import {typedAssertInstanceOf} from '@augment-vir/browser-testing';
import {assert, fixture as renderFixture} from '@open-wc/testing';
import {html} from 'element-vir';
import {VirIframeChildApp} from './vir-iframe-child-app.element';

describe(VirIframeChildApp.tagName, () => {
    it('renders without error', async () => {
        const fixture = await renderFixture(
            html`
                <${VirIframeChildApp}></${VirIframeChildApp}>
            `,
        );
        typedAssertInstanceOf(fixture, VirIframeChildApp);
        assert.notInclude(fixture.shadowRoot.textContent?.toLowerCase(), 'error');
    });
});
