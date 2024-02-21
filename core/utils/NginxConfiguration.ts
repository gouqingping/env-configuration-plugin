import { writeFileSync } from "node:fs"
import { OutputNginxConfiguration } from "../types"
import { DEFAULT_NGINX_CONFIGURATION } from "../enums"

export const outputNginx = (
  config?: Partial<OutputNginxConfiguration>,
  nginx?: string,
) => {
  const { output, port }: OutputNginxConfiguration = {
    ...DEFAULT_NGINX_CONFIGURATION,
    ...(config || {}),
  }
  const path = (output || '').replace(/^\/|\.\/+/g, '')
  const filePath = `/${path}/nginx.default.conf`
  const nginxContent = `
  server {
    listen       ${port || 80};
    server_name  localhost;
    access_log  /var/log/nginx/host.access.log  main;
    error_log  /var/log/nginx/error.log  error;
    ${nginx || ""}
    location / {
      root   /usr/share/nginx/html;
      try_files $uri $uri/ @router;
      index  index.html index.htm;
    }

    location @router {
      rewrite ^.*$ /index.html last;
    }

    error_page   500 502 503 504  /50x.html;

    location = /50x.html {
      root   /usr/share/nginx/html;
    }
  }`
  try {
    writeFileSync(filePath, nginxContent)
    console.log("✨ env-configuration-plugin create nginx.default.conf down")
  } catch (error) {
    console.error("🙅 env-configuration-plugin failed to create nginx.default.conf")
  }
}
