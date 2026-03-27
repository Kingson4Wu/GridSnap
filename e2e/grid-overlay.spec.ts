import { test, expect, Page } from '@playwright/test'
import * as path from 'path'
import * as fs from 'fs'

// A small red 100x100 JPEG encoded as base64 — used as a fake test image.
// Generated with: python3 -c "
//   from PIL import Image; import io, base64
//   img = Image.new('RGB', (400,400), (200,100,100))
//   buf = io.BytesIO(); img.save(buf, 'JPEG'); print(base64.b64encode(buf.getvalue()).decode())
// "
// Embedded here so the test has no external dependencies.
const TEST_IMAGE_B64 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
  'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN' +
  'DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy' +
  'MjIyMjL/wAARCACWAJYDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQD/8QAJhAA' +
  'AgIBBAIDAQEAAAAAAAAAAQIDBAUREiExBhNBUWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QA' +
  'FBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Ax4AAAAAAAAAAAAAAAAAAAAAAAAdG' +
  'jRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aN' +
  'GjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0a' +
  'NGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0' +
  'aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo0aNGjRo//Z'

const GRIDS = [
  { id: '3x3', rows: 3, cols: 3, label: '3×3' },
  { id: '2x2', rows: 2, cols: 2, label: '2×2' },
  { id: '1x2', rows: 1, cols: 2, label: '1×2' },
  { id: '1x3', rows: 1, cols: 3, label: '1×3' },
  { id: '1x4', rows: 1, cols: 4, label: '1×4' },
  { id: '2x3', rows: 2, cols: 3, label: '2×3' },
]

const RATIOS = [
  { id: 'square',         label: '1:1',  w: 1, h: 1  },
  { id: 'portrait-3-4',  label: '3:4',  w: 3, h: 4  },
  { id: 'portrait-4-5',  label: '4:5',  w: 4, h: 5  },
  { id: 'portrait-9-16', label: '9:16', w: 9, h: 16 },
]

async function loadTestImage(page: Page) {
  // Inject the test image into the file input via JavaScript
  const blob = Buffer.from(TEST_IMAGE_B64.replace(/\s/g, ''), 'base64')
  await page.evaluate(async (b64) => {
    const bytes = Uint8Array.from(atob(b64.replace(/\s/g, '')), c => c.charCodeAt(0))
    const file = new File([bytes], 'test.jpg', { type: 'image/jpeg' })
    const dt = new DataTransfer()
    dt.items.add(file)
    const input = document.querySelector('input[type=file]') as HTMLInputElement
    if (input) {
      Object.defineProperty(input, 'files', { value: dt.files })
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }, TEST_IMAGE_B64)
}

test.describe('Grid overlay alignment', () => {
  test.beforeEach(async ({ page }) => {
    // Use the Vite dev server (must be running: npm run dev)
    await page.goto('http://localhost:5173/GridSnap/')
    await page.setViewportSize({ width: 390, height: 844 }) // iPhone 14 viewport
    await loadTestImage(page)
    // Wait for the overlay to appear
    await page.waitForSelector('[data-testid="grid-overlay"]', { timeout: 5000 })
  })

  for (const grid of GRIDS) {
    for (const ratio of RATIOS) {
      test(`${grid.label} @ ${ratio.label} — overlay matches crop box`, async ({ page }) => {
        const expectedAspect = (grid.cols / grid.rows) * (ratio.w / ratio.h)

        // Select grid
        await page.getByText(grid.label).first().click()
        // Select ratio
        await page.getByText(ratio.label).first().click()

        // Wait for overlay to update
        await page.waitForTimeout(200)

        const overlay = page.locator('[data-testid="grid-overlay"]')
        const box = await overlay.boundingBox()
        expect(box).not.toBeNull()

        const actualAspect = box!.width / box!.height

        // Overlay aspect ratio must match the grid aspect ratio within 1%
        expect(actualAspect).toBeCloseTo(expectedAspect, 1)

        // Each cell must be the correct aspect ratio (width/height = ratio.w/ratio.h)
        const cellW = box!.width / grid.cols
        const cellH = box!.height / grid.rows
        const cellAspect = cellW / cellH
        const expectedCellAspect = ratio.w / ratio.h

        expect(cellAspect).toBeCloseTo(expectedCellAspect, 1)
      })
    }
  }
})
