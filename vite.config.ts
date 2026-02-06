import path from "path"
import tailwindcss from "@tailwindcss/vite"
import tsConfigPaths from 'vite-tsconfig-paths'
import {tanstackStart} from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import {nitro} from 'nitro/vite'
import {defineConfig} from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tsConfigPaths({
            projects: ['./tsconfig.json'],

        }),
        tanstackStart({
            spa: {enabled: true}
        }),
        nitro(),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
