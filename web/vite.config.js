import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Participa DF - Ouvidoria',
        short_name: 'Participa DF',
        description: 'Faça sua manifestação de ouvidoria de forma rápida e segura.',
        theme_color: '#0056b3', // Cor oficial do GDF (aproximada)
        background_color: '#ffffff',
        display: 'standalone', // Faz parecer app nativo (sem barra de URL)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173, // Porta padrão do Frontend
    host: true  // Permite acessar pelo celular na mesma rede Wi-Fi
  }
})