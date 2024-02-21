import { loadConf } from "./utils"
import { createProxy } from "./utils"
import {
  getViteProxy,
  NodeEnvConfiguration,
  EnvironmentConfiguration,
} from "./utils"
export const getArgvs = loadConf
export const getProxy = getViteProxy
export const createProxyConf = createProxy
export const NodeEnvConfigurationPlugin = NodeEnvConfiguration
export const ViteEnvironmentConfigurationPlugin = EnvironmentConfiguration
export default ViteEnvironmentConfigurationPlugin
