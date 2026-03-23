import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react({
    include: '**/*.{jsx,js}',  
  })],
  
  base: './',

  define: {
    'process.env.VITE_FLEETBO_ENTERPRISE_ID': JSON.stringify(process.env.VITE_FLEETBO_ENTERPRISE_ID),
    'process.env.VITE_FLEETBO_KEY_AP': JSON.stringify(process.env.VITE_FLEETBO_KEY_AP),
  },

  resolve: {
    alias: {
      '@fleetbo': path.resolve(__dirname, 'src/@fleetbo'),
      'app': path.resolve(__dirname, './src/app'),
    },
  },

  server: {
    port: 3000, 
    host: '0.0.0.0',
  },

  build: {
    outDir: 'build', 
  },
});
