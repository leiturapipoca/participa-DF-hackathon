import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Participa DF - Ouvidoria',
        short_name: 'Participa DF',
        description: 'Faça sua manifestação de ouvidoria de forma rápida e segura.',
        theme_color: '#0056b3', 
        background_color: '#ffffff',
        display: 'standalone', 
        icons: [
          {
            src: 'pwa-772x604.png',
            sizes: '772x604',
            type: 'image/png'
          },
          {
            src: 'pwa-255x255.png',
            sizes: '225x225',
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