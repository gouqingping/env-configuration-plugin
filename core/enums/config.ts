import {
  OutputEnvronmentConfiguration,
  OutputNginxConfiguration,
} from "../types"

export const name = "vite-environment-configuration-plugin"
export const DEFAULT_OUT_FILENAME = "env.conf"
export const DEFAULT_DIR = "build"
export const DEFAULT_PROT = 80

export const DEFAULT_CONFIGURATION: OutputEnvronmentConfiguration = {
  inputDir: "./",
  inputType: "js",
  isPro: false,
  devPath: "public",
}

export const DEFAULT_NGINX_CONFIGURATION: OutputNginxConfiguration = {
  output: DEFAULT_DIR,
  port: DEFAULT_PROT,
}
