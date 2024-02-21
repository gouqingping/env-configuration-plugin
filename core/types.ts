export type OutType = "js" | "json"
export type EnvType = "js" | "jsx" | "ts" | "tsx"
export interface OutputNginxConfiguration {
  port: number
  output?: string
}
export interface OutputEnvronmentConfiguration {
  inputDir: string
  inputType?: EnvType
  path?: string
  isPro?: boolean
  devPath?: string
  ng?: OutputNginxConfiguration | boolean
}
export interface ViteProxyInter {
  [k: string]: {
    secure?: boolean
    target: string
    changeOrigin: boolean
    ws: boolean
    rewrite: (path: any) => any
    [k: string]: any
  }
}
