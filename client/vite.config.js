import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue()
  ],

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },

  resolve: {
    alias: {
      src: resolve(__dirname, 'src/js'),
    }
  },

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,

    lib: {
      entry: resolve(__dirname, 'src/js/S3FileUploadField.js'),
      name: 'S3Upload',
      formats: ['iife'],
      fileName: () => 's3upload.js'
    },

    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 's3upload.css';
          return assetInfo.name;
        },
        inlineDynamicImports: true
      }
    },

    sourcemap: process.env.NODE_ENV !== 'production',
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false
  },
});
