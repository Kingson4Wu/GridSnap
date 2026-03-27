/**
 * Generate app icons using Playwright to render an SVG design.
 * Run: node scripts/generate-icons.mjs
 */
import { chromium } from '@playwright/test'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="#0f0f23"/>

  <!-- 3x3 grid cells -->
  <!-- Row 1 -->
  <rect x="80"  y="80"  width="100" height="100" rx="10" fill="#e94560" opacity="0.9"/>
  <rect x="206" y="80"  width="100" height="100" rx="10" fill="#e94560" opacity="0.6"/>
  <rect x="332" y="80"  width="100" height="100" rx="10" fill="#e94560" opacity="0.35"/>
  <!-- Row 2 -->
  <rect x="80"  y="206" width="100" height="100" rx="10" fill="#e94560" opacity="0.6"/>
  <rect x="206" y="206" width="100" height="100" rx="10" fill="#e94560" opacity="0.9"/>
  <rect x="332" y="206" width="100" height="100" rx="10" fill="#e94560" opacity="0.35"/>
  <!-- Row 3 -->
  <rect x="80"  y="332" width="100" height="100" rx="10" fill="#e94560" opacity="0.35"/>
  <rect x="206" y="332" width="100" height="100" rx="10" fill="#e94560" opacity="0.35"/>
  <rect x="332" y="332" width="100" height="100" rx="10" fill="#e94560" opacity="0.9"/>

  <!-- Scissor cut lines (horizontal + vertical through centre) -->
  <line x1="256" y1="60" x2="256" y2="452" stroke="white" stroke-width="6" stroke-opacity="0.25" stroke-dasharray="12,8"/>
  <line x1="60"  y1="256" x2="452" y2="256" stroke="white" stroke-width="6" stroke-opacity="0.25" stroke-dasharray="12,8"/>
</svg>
`

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>*{margin:0;padding:0;box-sizing:border-box;background:transparent}</style>
</head>
<body>
${ICON_SVG}
</body>
</html>`

const SIZES = [512, 192, 180]

async function generate() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  mkdirSync(resolve(__dirname, '../public/icons'), { recursive: true })

  for (const size of SIZES) {
    await page.setViewportSize({ width: size, height: size })
    await page.setContent(HTML)
    await page.locator('svg').evaluate((el, s) => {
      el.setAttribute('width', String(s))
      el.setAttribute('height', String(s))
    }, size)

    const buf = await page.locator('svg').screenshot({ type: 'png', omitBackground: true })
    const out = resolve(__dirname, `../public/icons/icon-${size}.png`)
    writeFileSync(out, buf)
    console.log(`✓ icon-${size}.png`)
  }

  await browser.close()
  console.log('Done.')
}

generate().catch(err => { console.error(err); process.exit(1) })
