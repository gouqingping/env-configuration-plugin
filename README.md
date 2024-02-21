<div align="center">
	<h2 style="margin:0;padding:0">env-configuration-plugin</h2>
</div>
<div align="center">
适用于前端项目配置管理的NPM插件，它能够简化环境配置的复杂性，使开发者能够更轻松地管理不同环境下的配置参数。通过该插件，你可以在不同的环境中灵活切换配置，从而更好地适应开发、测试和生产环境的需求。
</div>

## ✨ Features
##### 📦 灵活的配置管理
支持多种配置格式，使得配置文件的编写更加灵活方便。
##### 📦 环境切换便捷
简单的命令或配置，你可以轻松地切换不同环境，无需手动修改配置文件。
##### 📦 便捷运维
打包后自动生成当前环境 `env.conf.json` 配置文件以及代理 `nginx.default.conf` 配置
##### 📦 安全可靠
插件提供了配置加密功能，确保敏感信息在配置文件中的安全存储，防范潜在的安全风险。

## 🔥 Usage

Via `env.conf` (Recommended)

1. `[[XXX]]` 环境名称，与 `package.json` 中 `scripts` `--mode NODE_ENV` 匹配
2. `[xxx]` 配置名字，后期系统中调用需要。
3. `xxx=xxx` 详细配置

多个环境配置的情况下，这个格式不断重复调整环境参数。

在非`build` 或者 `NODE_ENV=production` 或者 `NODE_ENV=pro` 并且 `outDir` 不为空的情况下都会在
`outDir` 目录下创建对应配置文件可作为外部引入文件处理。

## 🚀 Install

```node
$ npm install -D env-configuration-plugin
// or
$ yarn add -D env-configuration-plugin
// or
$ pnpm install -D env-configuration-plugin
```

## 🚀 Config
项目目录下创建一个 `env.conf` 文件，并根据需要添加不同环境的配置参数，例如：

```ini
[[dev]] // 环境配置名称
[api] // 参数名称
requestURL = "xxx.xxx.test"
[config] // 参数名称
systemName = "DevTest"
requestURL = "xxx.pro.test"

[[production]]
[api]
requestURL = "xxx.pro.test"
[config]
// 系统名称
qasd = "系统名称"
systemName = "Test";
iiii = 123123
arr = [1,2,3,4,5,6,7,8]
obj = {a:1,b:2,c:3}
isTre = true
```

## 🚀 Introduction
在你的工程配置中引入插件，并指定配置文件路径：
```ts
import { getProxy, getArgvs, ViteEnvironmentConfigurationPlugin } from "env-configuration-plugin"
export default {
  const { VITE_PORT, VITE_PUBLIC_PATH } = getArgvs()
	const proxy = getProxy()
  return defineConfig({
    ……
    base: VITE_PUBLIC_PATH,
		plugins: [
			ViteEnvironmentConfigurationPlugin({
        inputType: "ts",
        inputDir: `/`,
        path: VITE_PUBLIC_PATH,
				ng: {
					port: 8088
				}
      })
		],
    server: {
      cors: true,
      port: VITE_PORT || 3000,
      proxy,
      hmr: true,
    },
  })
}
```


## 🚀 package.json

```
{
	……
	"scripts": {
		"dev": "node ./index.js --mode NODE_ENV=dev",
		"test": "node ./index.js --mode NODE_ENV=test",
		"production": "node ./index.js --mode NODE_ENV=production",
	}
	……
}
```

## getArgvs(): AnyObject
获取命令行配置

### Use
```
{
	……
	"scripts": {
		"dev": "node ./index.js --mode NODE_ENV=dev",
	}
	……
}
```

```ts
import { getArgvs } from 'env-configuration-plugin';
getArgvs() // {NODE_ENV:'dev'}
```


## getProxy(): ViteProxyInter
获取 `env.conf` 内 `[proxy]` `vite proxy` 配置

### Use
 env.conf
```ini
[[dev]]
[proxy]
"/api/v1" = "http://127.0.0.226:8108/api/v1"
[api]
base = "http://127.0.0.226:8108/api/v1"
……
```
vite.config.ts
```ts
import { ConfigEnv, UserConfigExport, UserConfig, defineConfig } from "vite"
import { getProxy, getArgvs } from "env-configuration-plugin"
export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_PORT, VITE_PUBLIC_PATH } = getArgvs()
	const proxy = getProxy()
	// {
	// "/api/v1":{
	// 	 target: "http://127.0.0.226:8108/api/v1",
	// 	 changeOrigin: true,
	// 	 ws: true,
	// 	 rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
	// 	 secure: false,
	//  }
	// }
  return defineConfig({
    ……
    base: VITE_PUBLIC_PATH,
    server: {
      cors: true,
      port: VITE_PORT || 3000,
      proxy,
      hmr: true,
    },
  })
}
```

## ViteEnvironmentConfigurationPlugin(conf?:OutputEnvronmentConfiguration): VitePlugin
生成配置 `env.conf.(t|j)s` 文件


### Use
 env.conf
```ini
[[dev]]
[proxy]
"/api/v1" = "http://127.0.0.226:8108/api/v1"
[api]
base = "http://127.0.0.226:8108/api/v1"
[config]
logo = "/logo.png"
[theme]
primaryColor = "#3B82F6"
```

vite.config.ts
```ts
import { ConfigEnv, UserConfigExport, UserConfig, defineConfig } from "vite"
import { getProxy, getArgvs, ViteEnvironmentConfigurationPlugin } from "env-configuration-plugin"
export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_PORT, VITE_PUBLIC_PATH } = getArgvs()
	const proxy = getProxy()
  return defineConfig({
    ……
    base: VITE_PUBLIC_PATH,
		plugins: [
			ViteEnvironmentConfigurationPlugin({
        inputType: "ts",
        inputDir: `/`,
        path: VITE_PUBLIC_PATH,
				ng: {
					port: 8088
				}
      })
		],
    server: {
      cors: true,
      port: VITE_PORT || 3000,
      proxy,
      hmr: true,
    },
  })
}
```

### OutputEnvronmentConfiguration

| 参数名称 | 类型     | 描述                             | 是否必填 | 默认参数 | 备选参数              |
| -------- | -------- | -------------------------------- | -------- | -------- | --------------------- | 
| `inputDir`    | `string` | 开发环境配置文件输出位置  | `yes`        | `js`     | `jsx`/`js`/`ts`/`tsx` |
| `inputType`    | `string` | 开发环境需要什么`env.conf.*`类型文件  | -        | `js`     | `jsx`/`js`/`ts`/`tsx` |
| `path`   | `string` | 开发环境`env.conf.*`类型文件输出位置 | -        | `src`    | -                     |
| `isPro`  | `boolen` | 当前是否为生产版本               | -        | `false`  | -                     |
| `ng`  | `{port: number,output?: string}` | 如果 `ng` 存在则输出 `nginx.conf` 配置文件 | -        | `false`  | -                     |

#### ng

| 参数名称 | 类型     | 描述                             | 是否必填 | 默认参数 | 备选参数              |
| -------- | -------- | -------------------------------- | -------- | -------- | --------------------- |
| `port`    | `number` | 前端访问端口号  | -        | `-`     | `-` |
| `output`    | `string` | `nginx.conf` 输出位置  | -        | `-`     | `-` |

### env.conf production

```
|--dist
	|-- ……
	|-- env.conf.config.js
	|-- ……
```

以`production` 环境为例

##### env.conf.config.js

```js
var envConf = {
	ENV: 'production',
	api: {
		requestURL: 'http://xxx.api.pro.com',
	},
	config: {
		systemName: 'Production system name',
	},
};
```

##### env.conf.config.json

```json
{
	"ENV": "production",
	"api": {
		"requestURL": "http://xxx.api.pro.com"
	},
	"config": {
		"systemName": "Production system name"
	}
}
```

### env.conf development

```
|--src
	|-- ……
	|-- env.conf.config.js
	|-- ……
```

以`dev` 环境为例

##### env.conf.config.js

```js
export const ENV = 'dev';
export const api = {
	requestURL: 'http://xxx.api.dev.com',
};
export const config = {
	systemName: 'DevDependencies system name',
};

export default { api, config, ENV };
```

### 问题反馈

在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

-   [Email](https://gouqingping@yahoo.com)
-   [Github](https://github.com/gouqingping)
