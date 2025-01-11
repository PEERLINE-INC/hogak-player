// vite.config.ts
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "file:///Users/peerline/Documents/proj/hogak-player/node_modules/glob/dist/esm/index.js";
import { defineConfig } from "file:///Users/peerline/Documents/proj/hogak-player/node_modules/vite/dist/node/index.js";
import react from "file:///Users/peerline/Documents/proj/hogak-player/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///Users/peerline/Documents/proj/hogak-player/node_modules/vite-plugin-dts/dist/index.mjs";
import { libInjectCss } from "file:///Users/peerline/Documents/proj/hogak-player/node_modules/vite-plugin-lib-inject-css/dist/index.js";
import svgr from "file:///Users/peerline/Documents/proj/hogak-player/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "/Users/peerline/Documents/proj/hogak-player";
var __vite_injected_original_import_meta_url = "file:///Users/peerline/Documents/proj/hogak-player/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // https://github.com/vitejs/vite/issues/1579#issuecomment-1483756199
    libInjectCss(),
    dts({ exclude: ["**/*.stories.ts", "src/test", "**/*.test.tsx"] }),
    svgr({
      include: "**/*.svg?react"
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
    }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcGVlcmxpbmUvRG9jdW1lbnRzL3Byb2ovaG9nYWstcGxheWVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcGVlcmxpbmUvRG9jdW1lbnRzL3Byb2ovaG9nYWstcGxheWVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9wZWVybGluZS9Eb2N1bWVudHMvcHJvai9ob2dhay1wbGF5ZXIvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbmltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgeyBsaWJJbmplY3RDc3MgfSBmcm9tICd2aXRlLXBsdWdpbi1saWItaW5qZWN0LWNzcydcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVqcy92aXRlL2lzc3Vlcy8xNTc5I2lzc3VlY29tbWVudC0xNDgzNzU2MTk5XG4gICAgbGliSW5qZWN0Q3NzKCksXG4gICAgZHRzKHsgZXhjbHVkZTogWycqKi8qLnN0b3JpZXMudHMnLCAnc3JjL3Rlc3QnLCAnKiovKi50ZXN0LnRzeCddIH0pLFxuICAgIHN2Z3Ioe1xuICAgICAgaW5jbHVkZTogXCIqKi8qLnN2Zz9yZWFjdFwiLFxuICAgIH0pLFxuICBdLFxuICBidWlsZDoge1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL21haW4udHMnKSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC9qc3gtcnVudGltZSddLFxuICAgICAgLy8gaHR0cHM6Ly9yb2xsdXBqcy5vcmcvY29uZmlndXJhdGlvbi1vcHRpb25zLyNpbnB1dFxuICAgICAgaW5wdXQ6IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgZ2xvYlN5bmMoWydzcmMvY29tcG9uZW50cy8qKi9pbmRleC50c3gnLCAnc3JjL21haW4udHMnXSkubWFwKChmaWxlKSA9PiB7XG4gICAgICAgICAgLy8gVGhpcyByZW1vdmUgYHNyYy9gIGFzIHdlbGwgYXMgdGhlIGZpbGUgZXh0ZW5zaW9uIGZyb20gZWFjaFxuICAgICAgICAgIC8vIGZpbGUsIHNvIGUuZy4gc3JjL25lc3RlZC9mb28uanMgYmVjb21lcyBuZXN0ZWQvZm9vXG4gICAgICAgICAgY29uc3QgZW50cnlOYW1lID0gcGF0aC5yZWxhdGl2ZShcbiAgICAgICAgICAgICdzcmMnLFxuICAgICAgICAgICAgZmlsZS5zbGljZSgwLCBmaWxlLmxlbmd0aCAtIHBhdGguZXh0bmFtZShmaWxlKS5sZW5ndGgpXG4gICAgICAgICAgKVxuICAgICAgICAgIC8vIFRoaXMgZXhwYW5kcyB0aGUgcmVsYXRpdmUgcGF0aHMgdG8gYWJzb2x1dGUgcGF0aHMsIHNvIGUuZy5cbiAgICAgICAgICAvLyBzcmMvbmVzdGVkL2ZvbyBiZWNvbWVzIC9wcm9qZWN0L3NyYy9uZXN0ZWQvZm9vLmpzXG4gICAgICAgICAgY29uc3QgZW50cnlVcmwgPSBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoZmlsZSwgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgICAgICByZXR1cm4gW2VudHJ5TmFtZSwgZW50cnlVcmxdXG4gICAgICAgIH0pXG4gICAgICApLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdW2V4dG5hbWVdJyxcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIHJlYWN0OiAnUmVhY3QnLFxuICAgICAgICAgICdyZWFjdC1kb20nOiAnUmVhY3QtZG9tJyxcbiAgICAgICAgICAncmVhY3QvanN4LXJ1bnRpbWUnOiAncmVhY3QvanN4LXJ1bnRpbWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBzZXR1cEZpbGVzOiAnLi9zcmMvdGVzdC9zZXR1cC50cycsXG4gICAgLy8geW91IG1pZ2h0IHdhbnQgdG8gZGlzYWJsZSBpdCwgaWYgeW91IGRvbid0IGhhdmUgdGVzdHMgdGhhdCByZWx5IG9uIENTU1xuICAgIC8vIHNpbmNlIHBhcnNpbmcgQ1NTIGlzIHNsb3dcbiAgICBjc3M6IHRydWUsXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIGluY2x1ZGU6IFsnc3JjL2NvbXBvbmVudHMnXSxcbiAgICAgIGV4Y2x1ZGU6IFsnKiovKi5zdG9yaWVzLnRzJ10sXG4gICAgfSxcbiAgfSxcbiAgYXNzZXRzSW5jbHVkZTogWycqKi8qLndvZmYnLCAnKiovKi53b2ZmMiddLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxPQUFPLFFBQVEsZUFBZTtBQUM5QixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGdCQUFnQjtBQUN6QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sVUFBVTtBQVRqQixJQUFNLG1DQUFtQztBQUFxSixJQUFNLDJDQUEyQztBQVkvTyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUE7QUFBQSxJQUVOLGFBQWE7QUFBQSxJQUNiLElBQUksRUFBRSxTQUFTLENBQUMsbUJBQW1CLFlBQVksZUFBZSxFQUFFLENBQUM7QUFBQSxJQUNqRSxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUN2QyxTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxhQUFhLG1CQUFtQjtBQUFBO0FBQUEsTUFFcEQsT0FBTyxPQUFPO0FBQUEsUUFDWixTQUFTLENBQUMsK0JBQStCLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTO0FBR3JFLGdCQUFNLFlBQVksS0FBSztBQUFBLFlBQ3JCO0FBQUEsWUFDQSxLQUFLLE1BQU0sR0FBRyxLQUFLLFNBQVMsS0FBSyxRQUFRLElBQUksRUFBRSxNQUFNO0FBQUEsVUFDdkQ7QUFHQSxnQkFBTSxXQUFXLGNBQWMsSUFBSSxJQUFJLE1BQU0sd0NBQWUsQ0FBQztBQUM3RCxpQkFBTyxDQUFDLFdBQVcsUUFBUTtBQUFBLFFBQzdCLENBQUM7QUFBQSxNQUNIO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsVUFDYixxQkFBcUI7QUFBQSxRQUN2QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBO0FBQUE7QUFBQSxJQUdaLEtBQUs7QUFBQSxJQUNMLFVBQVU7QUFBQSxNQUNSLFNBQVMsQ0FBQyxnQkFBZ0I7QUFBQSxNQUMxQixTQUFTLENBQUMsaUJBQWlCO0FBQUEsSUFDN0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlLENBQUMsYUFBYSxZQUFZO0FBQzNDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
