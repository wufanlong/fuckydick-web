import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vuetify from 'vite-plugin-vuetify'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vuetify({ autoImport: true }),
    AutoImport({
      imports: ['vue'],
      dts: 'auto-imports.d.ts',
    }),
  ]
});
