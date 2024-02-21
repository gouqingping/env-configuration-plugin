import { ViteProxyInter } from "../types";
export declare const isBuild: () => boolean;
export declare const isProd: (env: string) => boolean;
export declare const isString: (data: any) => boolean;
export declare const isObject: (data: any) => boolean;
export declare const isObjEmpty: (obj: {
    [k: string]: any;
}) => boolean;
export declare const loadConf: () => {
    [k: string]: any;
};
export declare const isIPURL: (str: string) => number | true;
export declare const getLastStr: (str: string) => void;
export declare const getProxy: (arr: {
    [k: string]: string;
}) => {
    proxys: [string, string][];
    nginx: string;
};
export declare const createProxy: (list?: [string, string][]) => ViteProxyInter;
export declare const createWorker: (str: string) => {
    [k: string]: any;
};
