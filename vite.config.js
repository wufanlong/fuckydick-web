import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import vuetify from "vite-plugin-vuetify";
import AutoImport from 'unplugin-auto-import/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vuetify({ autoImport: true }), // 自动引入组件 & 指令
    AutoImport({
      imports: ['vue'], // 自动导入 vue 的 ref、reactive、computed 等
      dts: 'src/auto-imports.d.ts', // 生成类型声明文件
    }),
  ],
});

