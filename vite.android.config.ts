import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = process.cwd();

export default defineConfig({
  root: resolve(projectRoot, "android-web"),
  base: "/",
  publicDir: resolve(projectRoot, "public"),
  define: { "import.meta.env.VITE_ANDROID_APP": JSON.stringify("true") },
  resolve: {
    alias: {
      "@/lib/maydan/api": resolve(projectRoot, "src/lib/maydan/api.android.ts"),
      "@": resolve(projectRoot, "src"),
    },
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: resolve(projectRoot, "android/app/src/main/assets/www"),
    emptyOutDir: true,
    sourcemap: false,
    target: "es2022",
  },
});
