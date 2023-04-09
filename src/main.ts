import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/main.css'
import axios from 'axios'
// vue virtual scroller
import "vue-virtual-scroller/dist/vue-virtual-scroller.css" // 引入它的 css
import VueVirtualScroller from "vue-virtual-scroller" // 引入它



const app = createApp(App)
// 引入icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(VueVirtualScroller) // use 它


app.mount('#app')
