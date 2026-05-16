import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true, // Позволяет использовать expect, describe без импорта
        environment: 'node', // или 'jsdom' для фронтенда
    },
})
