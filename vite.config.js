import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: '**/*.{jsx,js}',  // ← parse JSX dans .js aussi
  })],
  
  base: './',

  define: {
    'process.env.VITE_FLEETBO_ENTERPRISE_ID': JSON.stringify(process.env.VITE_FLEETBO_ENTERPRISE_ID),
    'process.env.VITE_FLEETBO_KEY_AP': JSON.stringify(process.env.VITE_FLEETBO_KEY_AP),
  },

  // Alias @fleetbo → src/@fleetbo (identique à l'ancien CRA)
  resolve: {
    alias: {
      '@fleetbo': path.resolve(__dirname, 'src/@fleetbo'),
      'app': path.resolve(__dirname, './src/app'),
    },
  },

  server: {
    port: 3000, // Même port que CRA pour ne pas casser le CLI Fleetbo
    host: '0.0.0.0',
  },

  build: {
    outDir: 'build', // CRA utilisait 'build', Vite utilise 'dist' par défaut
  },
});