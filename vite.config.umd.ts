// vite.config.umd.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
  build: {
    outDir: 'umd',
    // 라이브러리 모드지만, UMD + inlineDynamicImports
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'GlobalHogakPlayer', // 전역에서 window.GlobalHogakPlayer 로 접근
      formats: ['umd'],          // UMD 형식
      fileName: () => `hogak-player.umd.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        // 전역 객체 이름(브라우저)
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM',
        },
        inlineDynamicImports: true,
      },
    },
  },
})
