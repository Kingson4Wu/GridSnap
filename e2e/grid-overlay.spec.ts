import { test, expect } from '@playwright/test'
import { fileURLToPath } from 'url'
import * as path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_IMAGE = path.join(__dirname, 'fixtures', 'test.png')

const GRIDS = [
  { id: '3x3', rows: 3, cols: 3, label: '3×3' },
  { id: '2x2', rows: 2, cols: 2, label: '2×2' },
  { id: '1x2', rows: 1, cols: 2, label: '1×2' },
  { id: '1x3', rows: 1, cols: 3, label: '1×3' },
  { id: '1x4', rows: 1, cols: 4, label: '1×4' },
  { id: '2x3', rows: 2, cols: 3, label: '2×3' },
]

const RATIOS = [
  { label: '1:1',  w: 1, h: 1  },
  { label: '3:4',  w: 3, h: 4  },
  { label: '4:5',  w: 4, h: 5  },
  { label: '9:16', w: 9, h: 16 },
]

test.describe('Grid overlay alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 390, height: 844 })

    // Use Playwright's setInputFiles — works reliably in CI without dialog
    const fileInput = page.locator('input[type=file]')
    await fileInput.setInputFiles(FIXTURE_IMAGE)

    // Wait for react-easy-crop to render and overlay to appear
    await page.waitForSelector('[data-testid="grid-overlay"]', { timeout: 10_000 })
  })

  for (const grid of GRIDS) {
    for (const ratio of RATIOS) {
      test(`${grid.label} @ ${ratio.label} — cells have correct aspect ratio`, async ({ page }) => {
        const expectedGridAspect = (grid.cols / grid.rows) * (ratio.w / ratio.h)
        const expectedCellAspect = ratio.w / ratio.h

        await page.getByRole('button', { name: grid.label }).click()
        await page.getByText(ratio.label).first().click()
        await page.waitForTimeout(300)

        const overlay = page.locator('[data-testid="grid-overlay"]')
        const box = await overlay.boundingBox()
        expect(box, 'overlay must be visible').not.toBeNull()

        // Overall grid aspect ratio
        const actualGridAspect = box!.width / box!.height
        expect(actualGridAspect).toBeCloseTo(expectedGridAspect, 1)

        // Each cell's aspect ratio
        const cellW = box!.width / grid.cols
        const cellH = box!.height / grid.rows
        expect(cellW / cellH).toBeCloseTo(expectedCellAspect, 1)
      })
    }
  }
})
