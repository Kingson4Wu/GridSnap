import type { GridLayout, AspectRatio } from './types'

export const GRID_LAYOUTS: GridLayout[] = [
  { id: '3x3', rows: 3, cols: 3, label: '3×3' },
  { id: '2x2', rows: 2, cols: 2, label: '2×2' },
  { id: '1x2', rows: 1, cols: 2, label: '1×2' },
  { id: '1x3', rows: 1, cols: 3, label: '1×3' },
  { id: '1x4', rows: 1, cols: 4, label: '1×4' },
  { id: '2x3', rows: 2, cols: 3, label: '2×3' },
]

export const ASPECT_RATIOS: AspectRatio[] = [
  { id: 'square',         label: '1:1',  width: 1, height: 1  },
  { id: 'portrait-3-4',  label: '3:4',  width: 3, height: 4  },
  { id: 'portrait-4-5',  label: '4:5',  width: 4, height: 5  },
  { id: 'portrait-9-16', label: '9:16', width: 9, height: 16 },
]

/** Output pixel width per cell — height derived from ratio */
export const CELL_OUTPUT_WIDTH = 1080
