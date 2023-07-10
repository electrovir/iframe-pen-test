import {ports} from '@electrovir/iframe-pen-test-common/dist/cjs/port-numbers';
import {defineConfig} from 'virmator/dist/compiled-base-configs/base-vite';

export default defineConfig(
    {forGitHubPages: true},
    {
        server: {
            port: ports.parent,
            host: '127.0.0.1',
        },
    },
);
