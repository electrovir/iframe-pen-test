import {typedAssertInstanceOf} from '@augment-vir/browser-testing';
import {assert, fixture as renderFixture} from '@open-wc/testing';
import {html} from 'element-vir';
import {VirApp} from './vir-app.element';

describe(VirApp.tagName, () => {
    it('renders without error', async () => {
        const fixture = await renderFixture(
            html`
                <${VirApp}></${VirApp}>
            `,
        );
        typedAssertInstanceOf(fixture, VirApp);
        assert.notInclude(fixture.shadowRoot.textContent?.toLowerCase(), 'error');
    });
});
