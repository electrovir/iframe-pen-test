import {ports} from './port-numbers';

export enum FrontendEnvEnum {
    Dev = 'dev',
    Prod = 'prod',
}

export enum FrontendTypeEnum {
    Child = 'child',
    Parent = 'parent',
}

export type FullFrontendEnv = {env: FrontendEnvEnum; type: FrontendTypeEnum};

const devHostNames = [
    'localhost',
    '127.0.0.1',
];

function determineCurrentFrontendEnv(): FullFrontendEnv {
    /**
     * Location must be possibly undefined because these files are loaded by the vite config, in
     * Node.js, which does not have a location.
     */
    const location: Location | undefined = globalThis.location;

    const env: FrontendEnvEnum = devHostNames.includes(location?.hostname)
        ? FrontendEnvEnum.Dev
        : FrontendEnvEnum.Prod;
    const envType: FrontendTypeEnum =
        env === FrontendEnvEnum.Dev
            ? location?.port === String(ports.child)
                ? FrontendTypeEnum.Child
                : FrontendTypeEnum.Parent
            : FrontendTypeEnum.Parent;

    return {env, type: envType};
}

const currentEnvs: FullFrontendEnv = determineCurrentFrontendEnv();

export function isCurrentFrontendParent(checks: Partial<FullFrontendEnv>): boolean {
    const typeMatch = 'type' in checks ? checks.type === currentEnvs.type : true;
    const envMatch = 'env' in checks ? checks.env === currentEnvs.env : true;

    return typeMatch && envMatch;
}
