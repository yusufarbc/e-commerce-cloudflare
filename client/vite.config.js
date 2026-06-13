import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'E-Market',
                short_name: 'E-Market',
                description: 'Sunucusuz ve hızlı alışveriş platformunuz',
                theme_color: '#191919',
                background_color: '#FFFFFF',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                categories: ['shopping', 'business'],
                icons: [
                    {
                        src: 'icons/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
                globIgnores: ['**/images/og-image.png', '**/images/hero/**'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\.e-market-domain\.com\/api\/v1\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 // 24 hours
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
    envDir: '..',
    server: {
        host: true,
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8787',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                // Vite 8 (rolldown) requires manualChunks as a function, not an object
                manualChunks(id) {
                    if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                        return 'vendor';
                    }
                    if (id.includes('lucide-react') || id.includes('clsx')) {
                        return 'ui';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 1000
    }
})
