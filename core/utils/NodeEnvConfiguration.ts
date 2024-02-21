import {
  existsSync,
  mkdirSync,
  readdir,
  statSync,
  unlinkSync,
  unwatchFile,
  watchFile,
  writeFileSync,
} from "node:fs"
import { resolve } from "node:path"
import { isObjEmpty } from "./lib"
import { outputNginx } from "./NginxConfiguration"
import { DEFAULT_CONFIGURATION } from "../enums"
import { OutType, OutputEnvronmentConfiguration } from "../types"
import {
  createFile,
  defaultOutName,
  initConfiguration,
  initOutDir,
} from "./tools"

const watchFileListener = (
  cur: { mtime: any },
  prv: { mtime: any },
  config: {
    outDir: string
    dir: string
    content: string
    nginxConfig: any
    nginx: string
    devOutDir: string
  },
) => {
  const { outDir, dir, content, nginxConfig, nginx, devOutDir } = config || {}
  console.log(
    `⚡️ ${defaultOutName} watch:`,
    `${resolve(outDir)} file has changed ⚡️`,
  )
  if (cur.mtime !== prv.mtime) {
    try {
      const stats = statSync(resolve(dir))
      if (stats.isDirectory()) {
        createFile(dir, content)
        nginxConfig?.isExp && outputNginx(nginxConfig, nginx)
      } else {
        const ambStat = statSync(resolve(devOutDir))
        if (!ambStat) unlinkSync(resolve(devOutDir))
        nginxConfig?.isExp && outputNginx(nginxConfig, nginx)
        unwatchFile(resolve(outDir), (cur, prv) => {
          watchFileListener(cur, prv, {
            outDir,
            dir,
            content,
            nginxConfig,
            nginx,
            devOutDir,
          })
        })
        console.log(`⚡️ ${defaultOutName} done ⚡️`)
      }
    } catch (error) {
      createFile(dir, content)
      nginxConfig?.isExp && outputNginx(nginxConfig, nginx)
    }
  }
}

const watcherOutDir = (
  outDir: string,
  config: {
    dir: string
    content: string
    nginxConfig: any
    nginx: string
    devOutDir: string
  },
) => {
  const { dir, content, nginxConfig, nginx, devOutDir } = config
  readdir(resolve(outDir), (err) => {
    if (err) {
      try {
        const outArr = outDir?.split("/") || []
        outArr
          .map((item, i) => (i > 0 ? `${outArr[i - 1]}/${item}` : item))
          .forEach((element) => mkdirSync(element))
      } catch (e) {
        console.error(e)
      }
      watcherOutDir(outDir, config)
    } else {
      createFile(dir, content)
      nginxConfig?.isExp && outputNginx(nginxConfig, nginx)
      watchFile(resolve(outDir), (cur, prv) => {
        watchFileListener(cur, prv, {
          outDir,
          dir,
          content,
          nginxConfig,
          nginx,
          devOutDir,
        })
      })
    }
  })
}
export const NodeEnvConfiguration = (
  outType: OutType = "js",
  outDir = "dist",
  configuration: OutputEnvronmentConfiguration = DEFAULT_CONFIGURATION,
) => {
  console.log(`⚡️ ${defaultOutName} start ⚡️`)
  const {
    path,
    ENV,
    devOutDir,
    isPros,
    workerSource,
    nginx,
    outConfig,
    conetnt,
  } = initConfiguration(outType, outDir, configuration)
  const outFileName = initOutDir(outType)
  if (!isObjEmpty(workerSource)) return outConfig
  if (existsSync(resolve(path || ""))) {
    writeFileSync(devOutDir, conetnt)
  } else {
    mkdirSync(resolve(path || ""))
    writeFileSync(devOutDir, conetnt)
  }
  if (isPros) {
    delete workerSource.proxy
    const curJson = { ENV, CONFIG_URL: outFileName, ...workerSource }
    const outJs = `window.envConf = ${curJson}`
    watcherOutDir(outDir, {
      dir: `${outDir}/${outFileName}`,
      content: outType !== "json" ? outJs : JSON.stringify(curJson),
      nginxConfig: {},
      nginx,
      devOutDir,
    })
  }
  return outConfig
}
