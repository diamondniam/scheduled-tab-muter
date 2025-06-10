import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    minify: false,
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"), // main popup or page
        background: resolve(__dirname, "src/background.ts"), // background
      },
      output: {
        entryFileNames: (chunk) => {
          // keep background script named correctly
          if (chunk.name === "background") return "background.js";
          return "assets/[name].js";
        },
      },
    },
  },
});
