import { EnvType, OutType, OutputEnvronmentConfiguration } from "../types";
export declare const defaultOutName = "env.conf";
export declare const defaultExpName = "env.conf";
export declare const exps: string[];
export declare const initInputDir: (path: string, outType?: EnvType) => string;
export declare const initOutDir: (inputType?: OutType) => string;
export declare const isTs: (inputType?: EnvType) => boolean;
export declare const getWorkerProvider: (data: string, env: string) => {
    [k: string]: any;
};
export declare const initOutConfig: (source: {
    [k: string]: any;
}, outConf?: {
    [k: string]: any;
}) => {
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
    nginx: string;
};
export declare const createContent: (item: {
    [k: string]: any;
}, pro: boolean) => string;
export declare const workerEach: (isTs: boolean, workerSource: {
    [k: string]: any;
}, { env, pro, outFile, }: {
    env: string;
    pro: boolean;
    outFile: string;
}) => string;
export declare const createFile: (src: string, c: string) => void;
export declare const initConfiguration: (outType: OutType, outDir: string, conf: OutputEnvronmentConfiguration) => {
    path: string;
    ENV: any;
    devOutDir: string;
    isOutTs: boolean;
    isPros: boolean;
    workerSource: {
        [k: string]: any;
    };
    nginx: string;
    outConfig: {
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
    conetnt: string;
    outFileName: string;
};
