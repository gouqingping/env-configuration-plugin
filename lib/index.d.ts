export declare const getArgvs: () => {
    [k: string]: any;
};
export declare const getProxy: () => import("./types").ViteProxyInter;
export declare const createProxyConf: (list?: [string, string][]) => import("./types").ViteProxyInter;
export declare const NodeEnvConfigurationPlugin: (outType?: import("./types").OutType, outDir?: string, configuration?: import("./types").OutputEnvronmentConfiguration) => {
    proxy: import("./types").ViteProxyInter;
    plugin: {
        name: string;
        source: {
            [k: string]: any;
        };
        config: () => {
            type: any;
            outDir: any;
            path: any;
            inputType: any;
            isPro: any;
        };
    } | {
        name?: undefined;
        source?: undefined;
        config?: undefined;
    };
};
export declare const ViteEnvironmentConfigurationPlugin: (configuration: import("./types").OutputEnvronmentConfiguration) => any;
export default ViteEnvironmentConfigurationPlugin;
