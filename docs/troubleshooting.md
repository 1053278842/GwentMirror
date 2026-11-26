# 已知问题与排查

## 页面

**打开是白屏**

原始仓库没有 `/` 路由，已在 [changes.md](changes.md) 修掉。如果你在用上游代码，
访问 `/search` 能看到页面就说明只是根路由缺失。

**页面一直转 LOADING**

`DeckSearchView` 的 `loading` 只置 `true` 不置 `false`（见 [changes.md](changes.md) 第 3 条）。
临时验证可以看 Network 面板：`getRandomDecksLast` 已经有 200 响应却还在转圈，就是这个问题。

**顶部元素重叠、整页错位**

`CardSearchView.vue` 自我嵌套（见 [changes.md](changes.md) 第 1 条），恢复原始实现即可。

**卡组列表滚动错位**

卡组列表用 `vue-virtual-scroller` + 变高估算，窗口尺寸剧烈变化时偶发错位，刷新即恢复（原实现如此）。

**中文变成机翻英文/英文变成中文**

`index.html` 的 `lang` 与 `translate` 设置被改过，或者浏览器对本地地址强制翻译。
项目用的是 `lang="zh-CN"` + `notranslate`。

## 图片

**卡图全裂、控制台一堆 404**

两种情况：

1. 生产构建没把 `src/assets` 拷进 `dist/src/assets`（见
   [getting-started.md](getting-started.md#构建)）；
2. `CardView.vue` 里 `url("src/assets/...")` 少了前导 `/`（见 [changes.md](changes.md) 第 4 条）。

**只有部分卡没有图**

`GwentImg_preview` 只覆盖 1369 张卡，`allCard.json` 有 1171 条；
新增卡如果不在图库里，会显示成空白色块（`composite_deck_info` 找不到文件）。

## 构建

**`npm run build` 失败**

它会先跑 `vue-tsc` 类型检查，历史代码有类型报错。用 `npx vite build`。

**`vite build` 报 `Element is missing end tag`**

模板标签不配对，通常是 `DeckSearchView.vue`（见 [changes.md](changes.md) 第 2 条）。

**构建很慢 / chunk 很大**

`index-*.js` 打包了 1.7 MB（含 `allCard.json` 与 Element Plus），这是已知体积；
站点是内网/本地用，没有做代码分割。

## 接口

**请求 404：`/gmapi/deck/api/...`**

- dev 模式：`vite.config.ts` 的 `/gmapi` 还指向作者的线上环境（`117.50.175.251:8081`），
  要么改成 `http://localhost:8081`，要么改用 `/localapi` 前缀；
- 容器模式：nginx 的 `/gmapi/` 反代没生效，检查 `docker/nginx.conf`。

**请求 500**

看后端日志（`docker logs -f gwent-mirror`）。常见是上游代码里的两个必现 500，
详见 [后端 changes](https://github.com/1053278842/GwentMirrorService/blob/master/docs/changes.md)。

## 数据

**`/api-pg/*` 反代失败**

容器无外网时该路由不可用；前端卡牌数据已内置，不影响页面渲染。

**卡组数量比预期少**

首屏取的是「`create_time` 晚于版本水位」的卡组，不是全量；全量用 `/deck/api/getDecks`。