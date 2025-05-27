// C:\laragon\www\sgcpro\src\public\script\react_modelo_v1\frontend\vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { getBaseUrl, getBaseApi } from './src/config/env.js';


export default defineConfig(({ command }) => {
  const baseURL = getBaseUrl();
  const baseApi = getBaseApi();
  // console.log('baseURL:', baseURL);
  // console.log('baseApi:', baseApi);
  const config = {
    plugins: [react()],
    base: './',
    build: {
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    server: {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      }
    }
  };

  // Adiciona o proxy apenas em modo de desenvolvimento
  if (command === 'serve') {
    config.server = {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      },
      proxy: {
        '/api': {
          target: baseURL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/src/public'),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              // console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // console.log('Enviando requisição para:', req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              // console.log('Recebida resposta de:', req.url, 'status:', proxyRes.statusCode);
            });
          }
        }
      }
    };
  }

  return config;
});