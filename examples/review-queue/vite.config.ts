import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

const repoRoot = resolve(__dirname, "../..")

export default defineConfig({
  root: __dirname,
  // Relative asset URLs, so the build can be served from any path (e.g. GitHub Pages).
  base: "./",
  plugins: [react()],
  resolve: {
    // The example imports the package by name, as a consumer would, but
    // resolves it to the source in this repo so it always runs the latest code.
    alias: [
      {
        find: /^@sidieyel\/wysiwyg-editor\/styles$/,
        replacement: resolve(repoRoot, "src/wysiwyg-editor.css"),
      },
      {
        find: /^@sidieyel\/wysiwyg-editor$/,
        replacement: resolve(repoRoot, "src/index.ts"),
      },
    ],
  },
  build: {
    outDir: resolve(repoRoot, "dist-example"),
    emptyOutDir: true,
  },
})
