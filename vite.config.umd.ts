// vite.config.umd.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'umd',
    // 라이브러리 모드지만, UMD + inlineDynamicImports
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'HogakPlayerGlobal', // 전역에서 window.HogakPlayerGlobal 로 접근
      formats: ['umd'],          // UMD 형식
      fileName: () => `hogak-player.umd.js`
    },
    rollupOptions: {
      // React를 **external 처리하지 않고**, 빌드에 포함
      external: [],
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
