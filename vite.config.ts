import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inlineCSS from './vite-plugin-inline-css'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inlineCSS()],
  build: {
    // CSSをインライン化する閾値を増やす（4KB以下はインライン化）
    cssCodeSplit: false,
    // アセットのインライン化閾値
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // CSSとJSのチャンク戦略
        manualChunks: undefined,
        // アセットファイル名の最適化
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/css/i.test(ext)) {
            return 'assets/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // ミニファイの最適化
    minify: 'esbuild'
  }
})
