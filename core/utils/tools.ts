/* eslint-disable prettier/prettier */
import {
  createProxy,
  createWorker,
  getProxy,
  isIPURL,
  isObject,
  isProd,
  isString,
  loadConf,
} from "./lib"
import { DEFAULT_CONFIGURATION, DEFAULT_OUT_FILENAME } from "../enums"
import { EnvType, OutType, OutputEnvronmentConfiguration } from "../types"
import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

export const defaultOutName = DEFAULT_OUT_FILENAME
export const defaultExpName = DEFAULT_OUT_FILENAME
export const exps = ["proxy"]

export const initInputDir = (path: string, outType: EnvType = "js") => {
  return `${path}/${defaultExpName}.${outType}`
}

export const initOutDir = (inputType: OutType = "js") => {
  return `${defaultOutName}.config.${inputType}`
}

export const isTs = (inputType: EnvType = "js") =>
  ["tsx", "ts"].includes(inputType)

export const getWorkerProvider = (data: string, env: string) => {
  const cur = data.split("[[")
  const content = cur.filter((item) => item.startsWith(`${env}]]`))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_name, currentWorker] = (content?.[0] || "").split(/]]/)
  return createWorker(currentWorker)
}

export const initOutConfig = (
  source: { [k: string]: any },
  outConf?: { [k: string]: any },
) => {
  const { outType, outDir, path, inputType, isPro } = outConf || {}
  const { proxys, nginx } = getProxy(source?.proxy || {})
  const plugin = outConf
    ? {
      name: defaultOutName,
      source,
      config: () => ({
        type: outType,
        outDir,
        path,
        inputType,
        isPro,
      }),
    }
    : {}
  return {
    proxy: createProxy(proxys),
    plugin,
    nginx,
  }
}

export const createContent = (
  item: { [k: string]: any },
  pro: boolean,
): string => {
  let curObjStr = `{\r\n\u0020`
  if (isObject(item)) {
    const curArr = Object.keys(item)
    curArr.forEach((cname, n) => {
      const itemStr = JSON.stringify(item[cname])
      const isCurLast = curArr.length - 1 === n
      const curItem = isString(item[cname]) ? `"${item[cname]}"` : item[cname]
      const cData = isObject(item[cname]) ? itemStr : curItem
      if (cname && cData) {
        const arrStr = Array.isArray(item[cname]) ? "[]" : '""'
        const dv = isObject(item[cname]) ? "{}" : arrStr
        const valueStr = pro && isIPURL(cData) === 0 ? dv : cData
        const last = isCurLast ? "" : ",\r\n"
        curObjStr = `${curObjStr}\u0020\u0020${cname}:${valueStr}${last} `
      }
    })
  }
  return curObjStr
}

export const workerEach = (
  isTs: boolean,
  workerSource: { [k: string]: any },
  {
    env,
    pro,
    outFile,
  }: {
    env: string
    pro: boolean
    outFile: string
  },
): string => {
  const strType = isTs ? ":string" : ""
  const objTYpe = isTs ? ":AnyObject" : ""
  let [expStr, curExpName] = [
    `export const ENV${strType} = "${env}";\r\nexport const CONFIG_URL${strType} = "${outFile}";\r\n`,
    "ENV,CONFIG_URL,",
  ]
  if (isTs) {
    expStr = `interface AnyObject { [k: string]: any }\r\n${expStr}\r\n`
  }
  const source = Object.keys(workerSource)
  source.forEach((name, index) => {
    const isSourceLast = source.length - 1 === index
    const cur = workerSource[name]
    if (cur && !exps.includes(name)) {
      const curObjStr = createContent(workerSource[name], pro)
      expStr = `${expStr}export const ${name}${objTYpe} = ${curObjStr}\r\n};\r\n`
      curExpName = `${curExpName}${name}${isSourceLast ? "" : ","}`
    }
  })
  return `${expStr}\r\nexport default {${curExpName.replace(/,$/, "")}}`
}

export const createFile = (src: string, c: string) => {
  return writeFileSync(resolve(src), c)
}

export const initConfiguration = (
  outType: OutType = "js",
  outDir = "dist",
  conf: OutputEnvronmentConfiguration,
) => {
  const { NODE_ENV: ENV } = loadConf()
  const { path, inputType, isPro, inputDir } = conf
  const lastName = `${inputDir}${(inputDir).endsWith("/") ? '' : '/'}`
  const confUrl = `${lastName || '/'}${defaultOutName}`
  const configStr = readFileSync(confUrl, "utf-8")
  const devOutDir = initInputDir(path || 'src', inputType)
  const isOutTs = isTs(inputType)
  const isPros = isPro || isProd(ENV)
  const workerSource = getWorkerProvider(configStr, ENV)
  const outConf = { outType, outDir, path, inputType, isPro: isPros }
  const { nginx, ...outConfig } = initOutConfig(workerSource, outConf)
  const outFileName = initOutDir(outType)
  const workerConfig = { env: ENV, pro: isPros, outFile: outFileName }
  const conetnt = workerEach(isOutTs, workerSource, workerConfig)
  return { path, ENV, devOutDir, isOutTs, isPros, workerSource, nginx, outConfig, conetnt, outFileName }
}
