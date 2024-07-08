/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

import vue from '@vitejs/plugin-vue';
import { generateSitemap } from 'sitemap-ts';

import svgIcon from './plugin/svgIcon';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: true,
        port: Number(process.env.VITE_ASSET_PORT),
        strictPort: true,
        hmr: {
            host: process.env.VITE_ASSET_HOST,
            port: Number(process.env.VITE_ASSET_PORT),
        },
    },
    base: process.env.BASE_URL,
    plugins: [vue(), svgIcon()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
        terserOptions: {
            compress: {
                // Prevent Infinity from being compressed to 1/0, may cause performance issues on Chrome
                keep_infinity: true,
                drop_console: false,
            },
            format: { comments: false },
        },
        minify: 'terser',
        // Speed up packing
        brotliSize: false,
    },
});
