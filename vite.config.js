import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        checkout: resolve(__dirname, "src/checkout.html"),
        confirmation: resolve(__dirname, "src/confirmation.html"),
        item: resolve(__dirname, "src/item.html"),
      },
    },
  },
  server: {
    host: "0.0.0.0",
  },
});