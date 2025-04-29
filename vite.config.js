// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  server: {
    port: 5173
  },
  build: {
    target: 'es2017'  // or 'es2015' if you want maximum mobile compatibility
  }
});
