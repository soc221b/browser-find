import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      fileName: "index",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "lib"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
