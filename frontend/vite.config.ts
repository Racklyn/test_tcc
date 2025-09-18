import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, path.resolve(__dirname, '..'), '')

    return {
        plugins: [
            vue(),
            vuetify({ autoImport: true }),
        ],
        resolve: {
            alias: {
                '@': '/src'
            }
        },
        define: {
            'import.meta.env.WEB_SERVICE_URL': JSON.stringify(env.WEB_SERVICE_URL || 'http://localhost:3000'),
            'import.meta.env.AI_SERVICE_PORT': JSON.stringify(env.AI_SERVICE_PORT || '8000'),
            'import.meta.env.SCRAPER_SERVICE_PORT': JSON.stringify(env.SCRAPER_SERVICE_PORT || '5000'),
            'import.meta.env.WEB_SERVICE_PORT': JSON.stringify(env.WEB_SERVICE_PORT || '3000'),
        }
    }
})
