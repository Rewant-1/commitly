import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
  react(),
    // Defer non-critical CSS by converting <link rel="stylesheet"> to print+onload
    {
      name: 'defer-css-links',
      transformIndexHtml: {
        enforce: 'post',
        transform(html) {
          return html.replace(
            /<link\s+rel="stylesheet"(.*?)>/g,
            (match) =>
              match
                .replace('rel="stylesheet"', 'rel="stylesheet" media="print" onload="this.media=\'all\'"')
          )
        },
      },
    },
  ],
  css: {
    postcss: './postcss.config.cjs',
  },
  build: {
    sourcemap: mode !== 'production',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
}))
