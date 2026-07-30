import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            include: ['src/week.ts'],
            reporter: ['text', 'json', 'html', 'json-summary'],
        },
    },
})
