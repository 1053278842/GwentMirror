import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // element按需自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },


  build: {
     chunkSizeWarningLimit: 1000,
     outDir: "dist",
     assetsDir: "src/assets", //指定静态资源存放路径
     // assetsPublicPath:'',
     sourcemap: true, //是否构建source map 文件
     terserOptions: {
       // 生产环境移除console
       compress: {
         drop_console: true,
         drop_debugger: true,
       },
     },
  },

  server: {
  proxy: {
    "/api-pg": {
      target: "https://www.playgwent.com",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api-pg/, ""),
    },
    "/gmapi": {
      target: "http://117.50.175.251:8081",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/gmapi/, ""),
    },
    "/localapi": {
      target: "http://localhost:8081",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/localapi/, ""),
    }
  },
},
})

