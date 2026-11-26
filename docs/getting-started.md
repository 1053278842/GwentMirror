# 本地开发与构建

## 前置

Node 18+（Vite 4 的要求），一个能连的后端（本机 8081 或容器）。

## 装依赖并起开发服务器

```bash
npm install
npm run dev          # http://localhost:5173
```

## 三个代理

`vite.config.ts` 里配了三个前缀：

| 前缀 | 目标 | 用途 |
| --- | --- | --- |
| `/gmapi` | `http://117.50.175.251:8081` | 作者的线上后端。**本地调试请改成 `http://localhost:8081`** |
| `/localapi` | `http://localhost:8081` | 本地后端（把 `api/gwentmirror.ts` 的前缀换成 `localapi` 即可） |
| `/api-pg` | `https://www.playgwent.com` | 官网数据（当前代码未使用） |

`src/api/gwentmirror.ts` 里所有请求都是 `gmapi/...` 开头（没有前导斜杠，相对当前页面），
所以浏览器侧和 nginx 侧用同一套路径。

## 构建

<a id="构建"></a>

```bash
npx vite build        # 只编译，不做类型检查
npm run build         # = vue-tsc 类型检查 + vite build（历史代码有类型报错，会失败）
```

构建产物布局：

```text
dist/
├─ index.html
└─ src/assets/                 # 注意不是默认的 assets/，由 vite.config.ts 的 assetsDir 指定
   ├─ index-*.js / *.css       # 打包后的代码
   └─ card/… other/…           # 从 src/assets 原样拷进来的卡图素材
```

> 为什么要手动拷 `src/assets`：`CardView.vue` 等文件里用的是
> `background-image: url("/src/assets/card/art/preview/...")` 这种**绝对路径**，
> 这些文件没有被 import，Vite 不会替你搬。镜像的 Dockerfile 里有一行
> `cp -r src/assets/. dist/src/assets/` 完成这件事。

自己构建后要把站点跑起来，也得补这一步：

```bash
npx vite build
mkdir -p dist/src && cp -r src/assets dist/src/assets
npx vite preview --port 4173
```

## 在容器里怎么托管

* nginx 直接把 `dist` 作为站点根目录，SPA 路由用 `try_files $uri /index.html` 回退；
* `/gmapi/` 反代到同容器内的 `127.0.0.1:8081`（去掉前缀）；
* `/api-pg/` 反代到 `www.playgwent.com`（离线环境不可用，但页面不依赖它）。

镜像的完整说明（构建层次、端口、环境变量）在
[GwentMirrorAllInOne 的 docker.md](https://github.com/1053278842/GwentMirrorAllInOne/blob/main/docs/docker.md)。

## 类型检查为什么跑不过

`npm run build` 会先跑 `vue-tsc`，历史代码（尤其是三个原型页与 `CardView`）有类型报错，
所以镜像与日常构建都只用 `npx vite build`。产物与类型检查无关。