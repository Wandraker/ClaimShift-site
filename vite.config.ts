import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? "/ClaimShift-site/" : "/",
  build: {
    sourcemap: false,
    target: "es2022",
  },
});
