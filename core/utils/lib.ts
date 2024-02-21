import net from "node:net"
import { ViteProxyInter } from "../types"

export const isBuild = () => {
  return process.argv.includes("build")
}

export const isProd = (env: string) => {
  return isBuild() || ["production", "pro", "prod"].includes(env)
}

export const isString = (data: any) => typeof data === "string"

export const isObject = (data: any) => {
  return Object.prototype.toString.call(data) === "[object Object]"
}

export const isObjEmpty = (obj: { [k: string]: any }) => {
  if (!isObject(obj)) return false
  return !!Object.keys(obj).length
}

export const loadConf = (): { [k: string]: any } => {
  const args = process.argv.slice(2)
  const configs = {}
  args.forEach((arg: string) => {
    if (!arg.startsWith("--")) {
      const [key, value] = arg.split("=")
      configs[key] = value
    }
  })
  return configs
}

export const isIPURL = (str: string) => {
  const isURL = /^(http?|https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(str)
  const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(str)
  return isURL || isIP || net.isIP(str)
}

export const getLastStr = (str: string) => {
  str.replace(/^(.*[n])*.*(.|n)$/g, "$2")
}

export const getProxy = (arr: {
  [k: string]: string
}): { proxys: [string, string][]; nginx: string } => {
  let nginx = ""
  const proxys: [string, string][] = []
  Object.keys(arr).forEach((name) => {
    const cname = name.replace(/"/g, "").replace(/'/g, "")
    const start = cname.startsWith("/") ? "" : "/"
    const proxyName = `${start}${cname}`
    const value = `${arr[name]}`.replace(/"/g, "").replace(/'/g, "")
    const end = value.endsWith("/") ? value : `${value}/`
    proxys.push([proxyName, value])
    nginx = `${nginx}
    location ${proxyName}/ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass ${value.endsWith("/") ? value : `${value}/`};
    }\n
    `
  })
  return { proxys, nginx: nginx.replace(/"/g, "") }
}

export const createProxy = (list: [string, string][] = []): ViteProxyInter => {
  const ret: ViteProxyInter = {}
  for (const [prefix, target] of list) {
    const isHttps = /^https:\/\//.test(target)
    ret[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
      ...(isHttps ? { secure: false } : {}),
    }
  }
  return ret
}

export const createWorker = (str: string): { [k: string]: any } => {
  const config = {}
  const regex = /\[(.*?)\]\s*([\s\S]*?)(?=\n\[|$)/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(str))) {
    const section = match[1]
    const sectionConfig = {}
    const values = match[2].split("\n")
    values.forEach((cstr: string) => {
      const [key, value] = cstr.split("=")
      const ckey = key.replace(/"/g, "")
      const isSpecialStr = /^[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(ckey)
      const cname = (isSpecialStr ? `"${ckey}"` : `${ckey}`).replace(/\s/g, "")
      let cvalue = (value || "").trim().replace(/;$/, "")
      try {
        if (cvalue.startsWith("{") && cvalue.endsWith("}")) {
          // eslint-disable-next-line no-eval
          cvalue = eval(`(${cvalue})`)
        } else {
          cvalue = JSON.parse(cvalue)
        }
      } catch (error) {
        cvalue = cvalue.replace(/"/g, "")
      }
      if (cname) sectionConfig[cname] = cvalue
    })
    config[section] = sectionConfig
  }
  return config
}
