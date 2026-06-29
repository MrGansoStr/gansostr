import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react"
    }),
  ],
   // Di a Vite que NO optimice onnxruntime-web
  optimizeDeps: {
    exclude: ['onnxruntime-web']
  },

  // Configura las cabeceras para Cross-Origin Isolation (necesario para multi-threading WASM)
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  // También añade las cabeceras para el servidor de vista previa (después de build)
  preview: {
     headers: {
       'Cross-Origin-Opener-Policy': 'same-origin',
       'Cross-Origin-Embedder-Policy': 'require-corp',
     },
   },
})
