import { defineConfig } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173/GridSnap/'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    // In CI: serve the pre-built dist/ with vite preview.
    // Locally: use the dev server (faster HMR).
    command: process.env.CI ? 'npm run preview' : 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
