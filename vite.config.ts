import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  server: {
    port: 3002,
  },
  plugins: [
    vue(),
    VueI18nPlugin({
      include: 'src/i18n/locales/**',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})