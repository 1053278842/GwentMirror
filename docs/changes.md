# 相对上游的改动

上游 HEAD 直接 `vite build` 是失败的，首页也跑不起来。改了 7 处，都不动视觉设计。

## 1. `CardSearchView.vue`：组件自我嵌套

HEAD 版本误把整个 `DeckSearchView` 页面复制了过来，还 `import` 了自己：

```js
import CardSearchView from "./CardSearchView.vue"   // 自己 import 自己
```

模板里又渲染了 `<CardSearchView>`，于是首页顶部无限嵌套、整页元素重叠。

**处理**：恢复成提交 `710ddc1` 里的原始「卡牌检索栏」实现——
一个搜索输入框 + 卡牌下拉虚拟列表 + 已选卡牌 token。

## 2. `DeckSearchView.vue`：多余的 `</template>`

模板多了一个结束标签，构建直接失败：

```text
[vite:vue] Element is missing end tag.
file: src/views/DeckSearchView.vue:2:3
```

**处理**：删掉多余的 `</template>`。

## 3. `DeckSearchView.vue`：LOADING 遮罩永不关闭

```js
const loading = ref(false)
// fetchData() 里 loading.value = true，但数据到达后没有置回 false
```

页面会被全屏遮罩永久盖住。

**处理**：`deckJsonToViewData()` 末尾置 `false`，并在两个请求上补 `.catch()`。

## 4. `CardView.vue`：20 处资源路径少了前导斜杠

```css
background-image: url("src/assets/card/art/preview/banner/default_nilfgaard.png");
```

绝对路径缺 `/` 时，生产环境（CSS 在 `/src/assets/*.css`）会解析成
`/src/assets/src/assets/...`，全部 404。

**处理**：统一改成 `url("/src/assets/...")`。

## 5. `index.html`：浏览器自动翻译破坏卡牌原文

`lang="en"` 会触发 Chrome 的整页翻译，卡牌英文名与技能文本被机翻成中文。

**处理**：改 `lang="zh-CN"` + `<meta name="google" content="notranslate">` + `translate="no"`，
标题也换成站点名。

## 6. `router/index.ts`：没有根路由

原始路由表只有 `/home` `/about` `/search` `/test`，直接访问 `/` 是白屏。

**处理**：加 `/ → /search` 重定向。

## 7. `assets/main.css`：body 外边距没重置

铺满视口时四周露出一圈白边。

**处理**：追加 `html, body { margin: 0; background: #0b0d0a }` 等少量容器化样式。

## 没做的事

* 没有动视觉与交互（配色、卡面样式、动效都保持原样）；
* 没有把三个原型页（`/home` `/about` `/test`）删掉或改造，只是不给入口；
* 没有加类型声明去修 `vue-tsc` 的报错——那会牵动大量历史代码，而构建不需要它。

> 逐条背景与影响范围也写在
> [GwentMirrorAllInOne 的 changes.md](https://github.com/1053278842/GwentMirrorAllInOne/blob/main/docs/changes.md) 里。