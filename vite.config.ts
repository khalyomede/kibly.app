import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
    plugins: [
        devtools(),
        tailwindcss(),
        solidPlugin(),
        createHtmlPlugin({
            minify: true, // enables minification in production
        }),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,wav,webp,avif,ico,jpg,jpeg}'],
                runtimeCaching: [
                    // Images (Apps icons)
                    {
                        handler: "CacheFirst",
                        urlPattern: /.*\.(webp|avif|png|ico|jpg|jpeg|wav)$/,
                        method: "GET",
                    },
                    // Fonts (Google fonts, Fontawesome, ...)
                    {
                        handler: "CacheFirst",
                        urlPattern: /.*\.(ttf|woff|woff2|otf)$/,
                        method: "GET",
                    }
                ],
                // Prevent stale/old assets in cache on next load
                skipWaiting: true,
                clientsClaim: true,
                cleanupOutdatedCaches: true,
            },
            devOptions: {
                enabled: false,
            },
            manifest: {
                name: "Kibby",
                short_name: "Kibby",
                description: "A cosy word guessing game.",
                theme_color: "#FFF7ED",
                dir: "ltr",
                lang: "en-US",
                scope: "/",
                display: "standalone",
                orientation: "portrait-primary",
                start_url: "/",
                id: "play-kibby.com",
                background_color: "#14532D",
                categories: [
                    "games",
                ],
                icons: [
                    {
                        src: `/icons/kibby-maskable-icon-1024.png`,
                        sizes: "1024x1024",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                    {
                        src: `/icons/kibby-maskable-icon-512.png`,
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                    {
                        src: `/icons/kibby-maskable-icon-192.png`,
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                    {
                        src: `/icons/kibby-maskable-duo-tone-icon-1024.png`,
                        sizes: "1024x1024",
                        type: "image/png",
                        purpose: "monochrome maskable",
                    },
                    {
                        src: `/icons/kibby-maskable-duo-tone-icon-512.png`,
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "monochrome maskable",
                    },
                    {
                        src: `/icons/kibby-maskable-duo-tone-icon-192.png`,
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "monochrome maskable",
                    },
                ],
            }
        }),
    ],
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
        minify: 'terser', // or 'esbuild' (but terser gives more control)
        terserOptions: {
            compress: true,
            mangle: true,
        },
    },
});
