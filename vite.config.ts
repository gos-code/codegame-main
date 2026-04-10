import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/codegame-mvp/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react','react-dom'],
          router: ['react-router'],
          firebase: ['firebase/app','firebase/auth','firebase/firestore','firebase/storage'],
          motion: ['motion/react'],
        }
      }
    }
  }
});
