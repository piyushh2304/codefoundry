import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ["monaco-themes"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "monaco-themes/themes": path.resolve(__dirname, "./node_modules/monaco-themes/themes"),
    },
  },
})
