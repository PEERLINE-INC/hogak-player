import { sentryVitePlugin } from "@sentry/vite-plugin";
/// <reference types="vite/client" />
/// <reference types="vitest" />
import path, { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // https://github.com/vitejs/vite/issues/1579#issuecomment-1483756199
    libInjectCss(),
    dts({ exclude: ['**/*.stories.ts', 'src/test', '**/*.test.tsx'] }),
    svgr({
      include: "**/*.svg?react",
    }),
    sentryVitePlugin({
      org: "peerline-im",
      project: "javascript-react"
    })
  ],
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      formats: ['es'],
    },

    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      // https://rollupjs.org/configuration-options/#input
      input: Object.fromEntries(
        globSync(['src/components/**/index.tsx', 'src/main.tsx']).map((file) => {
          // This remove `src/` as well as the file extension from each
          // file, so e.g. src/nested/foo.js becomes nested/foo
          const entryName = path.relative(
            'src',
            file.slice(0, file.length - path.extname(file).length)
          )
          // This expands the relative paths to absolute paths, so e.g.
          // src/nested/foo becomes /project/src/nested/foo.js
          const entryUrl = fileURLToPath(new URL(file, import.meta.url))
          return [entryName, entryUrl]
        })
      ),
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]',
        globals: {
          react: 'React',
          'react-dom': 'React-dom',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },

    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
    coverage: {
      include: ['src/components'],
      exclude: ['**/*.stories.ts'],
    },
  },
  assetsInclude: ['**/*.woff', '**/*.woff2'],
})