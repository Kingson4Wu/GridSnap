# GridSnap — Design Spec

**Date:** 2026-03-27
**Status:** Approved

---

## Overview

GridSnap is a mobile-first web app for cutting images into grid layouts, designed for social media content creation (Instagram multi-image posts, panoramic swipe effects, etc.). All image processing happens locally in the browser — no data is ever sent to a server. The app works offline after the first load and can be installed to the home screen as a PWA.

---

## Core User Flow

1. **Select image** — tap the selection area to open the system photo picker (`<input type="file" accept="image/*" capture>`)
2. **Configure grid** — choose a grid layout (rows × columns) and a cell aspect ratio
3. **Adjust composition** — pinch-to-zoom and drag the image within the grid frame to position it (whole image moves as one unit; all cells see different regions of the same image)
4. **Cut and save** — tap "保存到相册"; each cell is rendered via Canvas API into a separate image file, then saved to the device photo library

---

## Grid Layouts

Six layout options (rows × columns):

| Layout | Cells | Typical Use |
|--------|-------|-------------|
| 3 × 3  | 9     | Instagram 9-grid profile mosaic |
| 2 × 2  | 4     | Quad split |
| 1 × 2  | 2     | Horizontal 2-panel panoramic |
| 1 × 3  | 3     | Horizontal 3-panel panoramic |
| 1 × 4  | 4     | Horizontal 4-panel panoramic |
| 2 × 3  | 6     | 6-panel grid |

All 1×N layouts are horizontal (landscape split), intended for wide images that appear seamless when swiped through on Instagram.

---

## Cell Aspect Ratios

Four options, applied uniformly to all cells in the grid:

| Name | Ratio | Use Case |
|------|-------|----------|
| Square | 1:1 | Instagram standard |
| Portrait 3:4 | 3:4 | Classic portrait |
| Portrait 4:5 | 4:5 | Instagram portrait feed |
| Portrait 9:16 | 9:16 | Stories / Reels |

The total canvas size is derived from the cell ratio × grid dimensions. For example, a 3×3 grid with 1:1 cells produces a square canvas; a 1×3 grid with 1:1 cells produces a 3:1 wide canvas.

---

## Image Adjustment (Pan / Zoom)

After selecting a grid configuration, the user sees the image with a grid overlay. They can:

- **Drag** to reposition the image within the grid frame
- **Pinch-to-zoom** (two-finger gesture on mobile) to scale the image

The entire image moves as one unit — there is no per-cell independent adjustment. The grid is a fixed frame; the image moves behind it.

Implementation: **react-easy-crop**, which provides this exact avatar-crop-style interaction out of the box and handles touch gestures natively.

---

## Saving to Device

### Android
Each cell triggers an `<a href="blob-url" download="gridsnap-1.jpg">` click programmatically. Files download automatically into the gallery.

### iOS (Safari, iOS 15+)
Use the **Web Share API** (`navigator.share({ files: [...] })`):
- User taps 「保存到相册」
- iOS native share sheet appears
- User taps 「存储到照片图库」
- All cells saved in one confirmation

If Web Share API is unavailable (older iOS or non-Safari browser), fall back to opening each image in a new tab so the user can long-press to save.

---

## Technical Architecture

| Concern | Solution |
|---------|----------|
| Framework | React 18 + TypeScript + Vite |
| Image cropping UI | react-easy-crop |
| Image processing | Canvas API (client-side only) |
| Offline / PWA | Vite PWA plugin (vite-plugin-pwa) + Service Worker |
| Deployment | GitHub Pages (static, free) |
| Styling | Tailwind CSS (mobile-first) |

No backend. No authentication. No analytics. No external API calls after initial page load.

---

## UI Layout (Single-Page)

The app is a single page with these zones (top to bottom on mobile):

1. **Header** — app name "GridSnap", minimal
2. **Image preview area** — shows selected image with grid overlay; tap to select image if none loaded
3. **Grid selector** — horizontal scrollable row of 6 grid options (visual icons)
4. **Ratio selector** — horizontal row of 4 ratio options (Square / 3:4 / 4:5 / 9:16)
5. **Action button** — 「保存到相册」, full-width, prominent

The controls (grid selector + ratio selector) are always visible below the preview — no bottom sheet, no modals. Changing a selection instantly updates the grid overlay on the image preview.

---

## PWA Configuration

- `manifest.json`: app name "GridSnap", short name "GridSnap", display: `standalone`, orientation: `portrait`
- Service Worker: caches all static assets on install; serves from cache when offline
- Icon set: generated for iOS (180×180) and Android (192×192, 512×512)

---

## Out of Scope

- Image filters or color editing
- Per-cell independent image adjustment
- User accounts or cloud sync
- Image format conversion (output is always JPEG)
- Video or GIF support
- Landscape orientation lock (app works in portrait; landscape not optimized)
