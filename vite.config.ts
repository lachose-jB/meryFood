import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/storage', 'firebase/auth'],
          ui: ['@headlessui/vue', '@heroicons/vue'],
        }
      },
      // Exclure les fichiers admin du build en prod
      external: process.env.NODE_ENV === 'production'
        ? [
            path.resolve(__dirname, 'src/components/admin/ArticleEditForm.vue'),
            path.resolve(__dirname, 'src/components/admin/ArticleForm.vue'),
            path.resolve(__dirname, 'src/components/admin/ArticlesManager.vue'),
            path.resolve(__dirname, 'src/components/admin/BookingsManager.vue'),
            path.resolve(__dirname, 'src/components/admin/ProductEditForm.vue'),
            path.resolve(__dirname, 'src/components/admin/ProductForm.vue'),
            path.resolve(__dirname, 'src/components/admin/ProductsManager.vue'),
            path.resolve(__dirname, 'src/components/admin/PromotionForm.vue'),
            path.resolve(__dirname, 'src/components/admin/PromotionsManager.vue'),
            path.resolve(__dirname, 'src/views/admin/AdminLayout.vue'),
            path.resolve(__dirname, 'src/views/admin/*'),
          ]
        : [],
    },
    chunkSizeWarningLimit: 1000, // en kB
  }
})
