import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  // Do not start a web server automatically — run `npm run dev` separately
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173/GridSnap/',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
