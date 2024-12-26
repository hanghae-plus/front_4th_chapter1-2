import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import path from "path";

export default mergeConfig(
  defineConfig({
    server: {
      port: 3000,
    },
    esbuild: {
      jsxFactory: "createVNode",
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: "transform",
        jsxFactory: "createVNode",
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@storages": path.resolve(__dirname, "./src/storages"),
        "@stores": path.resolve(__dirname, "./src/stores"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@core": path.resolve(__dirname, "./src/core"),
        "@mock": path.resolve(__dirname, "./src/mock"),
        "@errors": path.resolve(__dirname, "./src/errors"),
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    },
  }),
);
