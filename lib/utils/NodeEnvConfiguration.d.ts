import { OutType, OutputEnvronmentConfiguration } from "../types";
export declare const NodeEnvConfiguration: (outType?: OutType, outDir?: string, configuration?: OutputEnvronmentConfiguration) => {
    proxy: import("../types").ViteProxyInter;
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
