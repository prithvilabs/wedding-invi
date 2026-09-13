import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs, so the build works from any subpath rather than
  // only from a domain root.
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssTarget: 'chrome90',
  },
});
