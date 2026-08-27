import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? "/ClaimShift-site/" : "/",
  build: {
    sourcemap: false,
    target: "es2022",
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        wiki: resolve(process.cwd(), "wiki/index.html"),
      },
    },
  },
});
