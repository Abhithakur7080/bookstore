import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  const isDevelopment = mode === 'development'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 4000,
      host: isDevelopment ? 'localhost' : '0.0.0.0', // localhost for dev, 0.0.0.0 for containers
      strictPort: true,
      open: isDevelopment, // Only open browser in development
    },
    preview: {
      port: parseInt(process.env.PORT || '10000'), // Use Render's PORT env var
      host: '0.0.0.0', // Always bind to 0.0.0.0 for preview/production
      strictPort: true,
      allowedHosts: [
        'bookstore-client-6l1s.onrender.com', // Your current domain
        '.onrender.com', // Allow any onrender.com subdomain
        'localhost', // Allow localhost for local testing
      ],
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction, // Sourcemaps only in dev
      minify: isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  }
})