import { existsSync, mkdirSync, writeFileSync } from "fs"
import { DEFAULT_CONFIGURATION, name } from "../enums"
import { OutputEnvronmentConfiguration } from "../types"
import { loadConf } from "./lib"
import { createFile, initConfiguration } from "./tools"
import { resolve } from "path"
import { outputNginx } from "./NginxConfiguration"

let options: any = {
  compiler: null,
  include: /\env.conf$/,
  reactivityTransform: false,
  root: process.cwd(),
  sourceMap: true,
  cssDevSourcemap: false,
  devToolsEnabled: false,
  conf: {},
}

export const getViteProxy = () => {
  const { configuration, root } = options
  const { outConfig } = initConfiguration("json", root, configuration)
  return outConfig?.proxy || {}
}

export const EnvironmentConfiguration = (
  configuration: OutputEnvronmentConfiguration,
): any => {
  const { NODE_ENV } = loadConf()
  const isProduction = NODE_ENV === "production"
  options = {
    ...options,
    configuration,
    isProduction,
    devToolsEnabled: !isProduction,
  }
  console.log("🚀 env-configuration-plugin start")
  return {
    name,
    api: {
      get options() {
        return options
      },
      set options(value) {
        options = value
      },
    },
    config(conf: { [k: string]: any }) {
      const curConf = initConfiguration(
        "json",
        conf.build.outDir,
        {
          ...DEFAULT_CONFIGURATION,
          ...(configuration || {}),
          inputDir: configuration?.inputDir || conf.root,
          path: configuration?.path || `${conf.root}/src`,
        },
      )
      options.conf = {
        build: conf.build,
        ...curConf,
      }
    },
    configResolved() {
      const { path, devOutDir, conetnt } = options.conf
      if (existsSync(resolve(path))) {
        writeFileSync(devOutDir, conetnt)
      } else {
        mkdirSync(resolve(path))
        writeFileSync(devOutDir, conetnt)
      }
    },
    async generateBundle() {
      const { isPros, outFileName, workerSource, ENV, build, nginx } = options.conf
      const ng = options?.configuration?.ng || {}
      const { proxy, ...Source } = workerSource
      if (isPros) {
        const url = `${build.outDir}/${outFileName}`
        createFile(url, JSON.stringify({ ENV, ...Source }))
        if (ng === true || typeof ng === 'object') {
          const cng = ng === true ? { port: 80 } : ng
          const output = cng?.output ? `${build.outDir}/${cng?.output}` : build.outDir
          outputNginx({ ...cng, output }, nginx)
        }
      }
      console.log("✨ env-configuration-plugin down")
    },
  }
}
