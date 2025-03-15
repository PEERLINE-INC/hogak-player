// vite.config.ts
import { sentryVitePlugin } from "file:///C:/Users/KYS1/proj/hogak-player/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "file:///C:/Users/KYS1/proj/hogak-player/node_modules/glob/dist/esm/index.js";
import { defineConfig } from "file:///C:/Users/KYS1/proj/hogak-player/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/KYS1/proj/hogak-player/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///C:/Users/KYS1/proj/hogak-player/node_modules/vite-plugin-dts/dist/index.mjs";
import { libInjectCss } from "file:///C:/Users/KYS1/proj/hogak-player/node_modules/vite-plugin-lib-inject-css/dist/index.js";
import svgr from "file:///C:/Users/KYS1/proj/hogak-player/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\KYS1\\proj\\hogak-player";
var __vite_injected_original_import_meta_url = "file:///C:/Users/KYS1/proj/hogak-player/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // https://github.com/vitejs/vite/issues/1579#issuecomment-1483756199
    libInjectCss(),
    dts({ exclude: ["**/*.stories.ts", "src/test", "**/*.test.tsx"] }),
    svgr({
      include: "**/*.svg?react"
    }),
    sentryVitePlugin({
      org: "peerline-im",
      project: "javascript-react"
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/main.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      // https://rollupjs.org/configuration-options/#input
      input: Object.fromEntries(
        globSync(["src/components/**/index.tsx", "src/main.ts"]).map((file) => {
          const entryName = path.relative(
            "src",
            file.slice(0, file.length - path.extname(file).length)
          );
          const entryUrl = fileURLToPath(new URL(file, __vite_injected_original_import_meta_url));
          return [entryName, entryUrl];
        })
      ),
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
        globals: {
          react: "React",
          "react-dom": "React-dom",
          "react/jsx-runtime": "react/jsx-runtime"
        }
      }
    },
    sourcemap: true
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
    coverage: {
      include: ["src/components"],
      exclude: ["**/*.stories.ts"]
    }
  },
  assetsInclude: ["**/*.woff", "**/*.woff2"]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLWVMxXFxcXHByb2pcXFxcaG9nYWstcGxheWVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLWVMxXFxcXHByb2pcXFxcaG9nYWstcGxheWVyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9LWVMxL3Byb2ovaG9nYWstcGxheWVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gXCJAc2VudHJ5L3ZpdGUtcGx1Z2luXCI7XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgeyBsaWJJbmplY3RDc3MgfSBmcm9tICd2aXRlLXBsdWdpbi1saWItaW5qZWN0LWNzcydcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2lzc3Vlcy8xNTc5I2lzc3VlY29tbWVudC0xNDgzNzU2MTk5XG4gICAgbGliSW5qZWN0Q3NzKCksXG4gICAgZHRzKHsgZXhjbHVkZTogWycqKi8qLnN0b3JpZXMudHMnLCAnc3JjL3Rlc3QnLCAnKiovKi50ZXN0LnRzeCddIH0pLFxuICAgIHN2Z3Ioe1xuICAgICAgaW5jbHVkZTogXCIqKi8qLnN2Zz9yZWFjdFwiLFxuICAgIH0pLFxuICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xuICAgICAgb3JnOiBcInBlZXJsaW5lLWltXCIsXG4gICAgICBwcm9qZWN0OiBcImphdmFzY3JpcHQtcmVhY3RcIlxuICAgIH0pXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbWFpbi50cycpLFxuICAgICAgZm9ybWF0czogWydlcyddLFxuICAgIH0sXG5cbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3QvanN4LXJ1bnRpbWUnXSxcbiAgICAgIC8vIGh0dHBzOi8vcm9sbHVwanMub3JnL2NvbmZpZ3VyYXRpb24tb3B0aW9ucy8jaW5wdXRcbiAgICAgIGlucHV0OiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIGdsb2JTeW5jKFsnc3JjL2NvbXBvbmVudHMvKiovaW5kZXgudHN4JywgJ3NyYy9tYWluLnRzJ10pLm1hcCgoZmlsZSkgPT4ge1xuICAgICAgICAgIC8vIFRoaXMgcmVtb3ZlIGBzcmMvYCBhcyB3ZWxsIGFzIHRoZSBmaWxlIGV4dGVuc2lvbiBmcm9tIGVhY2hcbiAgICAgICAgICAvLyBmaWxlLCBzbyBlLmcuIHNyYy9uZXN0ZWQvZm9vLmpzIGJlY29tZXMgbmVzdGVkL2Zvb1xuICAgICAgICAgIGNvbnN0IGVudHJ5TmFtZSA9IHBhdGgucmVsYXRpdmUoXG4gICAgICAgICAgICAnc3JjJyxcbiAgICAgICAgICAgIGZpbGUuc2xpY2UoMCwgZmlsZS5sZW5ndGggLSBwYXRoLmV4dG5hbWUoZmlsZSkubGVuZ3RoKVxuICAgICAgICAgIClcbiAgICAgICAgICAvLyBUaGlzIGV4cGFuZHMgdGhlIHJlbGF0aXZlIHBhdGhzIHRvIGFic29sdXRlIHBhdGhzLCBzbyBlLmcuXG4gICAgICAgICAgLy8gc3JjL25lc3RlZC9mb28gYmVjb21lcyAvcHJvamVjdC9zcmMvbmVzdGVkL2Zvby5qc1xuICAgICAgICAgIGNvbnN0IGVudHJ5VXJsID0gZmlsZVVSTFRvUGF0aChuZXcgVVJMKGZpbGUsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICAgICAgcmV0dXJuIFtlbnRyeU5hbWUsIGVudHJ5VXJsXVxuICAgICAgICB9KVxuICAgICAgKSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXVtleHRuYW1lXScsXG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogJ1JlYWN0JyxcbiAgICAgICAgICAncmVhY3QtZG9tJzogJ1JlYWN0LWRvbScsXG4gICAgICAgICAgJ3JlYWN0L2pzeC1ydW50aW1lJzogJ3JlYWN0L2pzeC1ydW50aW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIHNvdXJjZW1hcDogdHJ1ZVxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBzZXR1cEZpbGVzOiAnLi9zcmMvdGVzdC9zZXR1cC50cycsXG4gICAgLy8geW91IG1pZ2h0IHdhbnQgdG8gZGlzYWJsZSBpdCwgaWYgeW91IGRvbid0IGhhdmUgdGVzdHMgdGhhdCByZWx5IG9uIENTU1xuICAgIC8vIHNpbmNlIHBhcnNpbmcgQ1NTIGlzIHNsb3dcbiAgICBjc3M6IHRydWUsXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIGluY2x1ZGU6IFsnc3JjL2NvbXBvbmVudHMnXSxcbiAgICAgIGV4Y2x1ZGU6IFsnKiovKi5zdG9yaWVzLnRzJ10sXG4gICAgfSxcbiAgfSxcbiAgYXNzZXRzSW5jbHVkZTogWycqKi8qLndvZmYnLCAnKiovKi53b2ZmMiddLFxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlSLFNBQVMsd0JBQXdCO0FBRzFULE9BQU8sUUFBUSxlQUFlO0FBQzlCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsZ0JBQWdCO0FBQ3pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxVQUFVO0FBVmpCLElBQU0sbUNBQW1DO0FBQXNJLElBQU0sMkNBQTJDO0FBYWhPLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQTtBQUFBLElBRU4sYUFBYTtBQUFBLElBQ2IsSUFBSSxFQUFFLFNBQVMsQ0FBQyxtQkFBbUIsWUFBWSxlQUFlLEVBQUUsQ0FBQztBQUFBLElBQ2pFLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYLENBQUM7QUFBQSxJQUNELGlCQUFpQjtBQUFBLE1BQ2YsS0FBSztBQUFBLE1BQ0wsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDdkMsU0FBUyxDQUFDLElBQUk7QUFBQSxJQUNoQjtBQUFBLElBRUEsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsYUFBYSxtQkFBbUI7QUFBQTtBQUFBLE1BRXBELE9BQU8sT0FBTztBQUFBLFFBQ1osU0FBUyxDQUFDLCtCQUErQixhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUdyRSxnQkFBTSxZQUFZLEtBQUs7QUFBQSxZQUNyQjtBQUFBLFlBQ0EsS0FBSyxNQUFNLEdBQUcsS0FBSyxTQUFTLEtBQUssUUFBUSxJQUFJLEVBQUUsTUFBTTtBQUFBLFVBQ3ZEO0FBR0EsZ0JBQU0sV0FBVyxjQUFjLElBQUksSUFBSSxNQUFNLHdDQUFlLENBQUM7QUFDN0QsaUJBQU8sQ0FBQyxXQUFXLFFBQVE7QUFBQSxRQUM3QixDQUFDO0FBQUEsTUFDSDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsU0FBUztBQUFBLFVBQ1AsT0FBTztBQUFBLFVBQ1AsYUFBYTtBQUFBLFVBQ2IscUJBQXFCO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQTtBQUFBO0FBQUEsSUFHWixLQUFLO0FBQUEsSUFDTCxVQUFVO0FBQUEsTUFDUixTQUFTLENBQUMsZ0JBQWdCO0FBQUEsTUFDMUIsU0FBUyxDQUFDLGlCQUFpQjtBQUFBLElBQzdCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBZSxDQUFDLGFBQWEsWUFBWTtBQUMzQyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
