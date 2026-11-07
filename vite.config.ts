import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { markdownContent } from "./plugins/markdown-content"

// https://vite.dev/config/
export default defineConfig({
  plugins: [markdownContent(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
