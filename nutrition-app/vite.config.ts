import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Farklı port (5174) — SellerPilot'un dev sunucusuyla (5173) asla çakışmaz.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
