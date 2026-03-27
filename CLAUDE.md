# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at http://localhost:5173/GridSnap/
npm test             # Unit tests (Vitest, run once)
npm run lint         # ESLint
npm run build        # tsc + vite build → dist/
npm run e2e          # Playwright E2E (starts dev server automatically)

# Run a single unit test file
npx vitest run src/utils/shareApp.test.ts

# Run a single E2E test
npx playwright test e2e/grid-overlay.spec.ts
```

E2E tests run against the dev server locally and against `dist/` in CI (`PLAYWRIGHT_BASE_URL=http://localhost:4173/GridSnap/`).

## Architecture

**State ownership:** `App.tsx` owns all top-level state (`imageSrc`, `layout`, `ratio`, `rotation`, `shareOpen`, `loading`, `error`). Crop state (`crop`, `zoom`, `cropPixels`) lives in `useCropState` and is reset whenever image/layout/ratio/rotation changes.

**Grid overlay:** `react-easy-crop` doesn't expose its crop area position, so `CropArea.tsx` uses a `MutationObserver` + `ResizeObserver` + `rAF` loop to read the crop element's bounding rect from the DOM (`querySelector('[class*="CropArea"]')`) and position a CSS grid overlay on top. The overlay carries `data-testid="grid-overlay"` and is what E2E tests measure.

**Export pipeline** (`src/utils/canvasExport.ts`):
1. Load source image
2. If `rotation ≠ 0`, draw onto a rotated intermediate canvas (`rotateImageToCanvas`)
3. `computeCellSourceRegions` slices `cropPixels` into per-cell rects
4. All cells rendered and encoded as JPEG in parallel via `Promise.all`
5. Output is always 1080px wide; height derived from aspect ratio

**Save strategy** (`src/utils/saveToGallery.ts`): `navigator.share({ files })` on iOS Safari; anchor `<a download>` on Android/desktop.

**i18n** (`src/i18n.ts`): `navigator.language.startsWith('zh')` detected once at module load. All strings in the `t` object — no runtime switching.

**Share feature** (`src/utils/shareApp.ts` + `src/components/ShareSheet.tsx`): Shares the *app URL* (not image tiles). Platform URLs built by `buildShareUrl`. Copy uses Clipboard API with `textarea` + `execCommand` fallback.

## Key Conventions

- All utils in `src/utils/` are pure functions with no React dependencies — independently testable without rendering.
- Tailwind CSS only — no CSS files.
- TypeScript strict mode enforced (`noUnusedLocals`, `noUnusedParameters`, exhaustive switch guards with `never`).
- `npm ci --legacy-peer-deps` required (peer dep conflict between react-easy-crop and React 19).
- Grid buttons use `aria-label={layout.label}` (e.g. `"3×3"`) — E2E tests select them via `getByRole('button', { name: '3×3' })`.
