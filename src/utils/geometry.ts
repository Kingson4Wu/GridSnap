import { CELL_OUTPUT_WIDTH } from '../constants'
import type { CropPixels } from '../types'

/**
 * Compute the aspect ratio of the entire grid frame.
 * Used as the `aspect` prop for react-easy-crop.
 */
export function computeGridAspect(
  rows: number,
  cols: number,
  cellRatioW: number,
  cellRatioH: number,
): number {
  return (cols / rows) * (cellRatioW / cellRatioH)
}

/**
 * Compute the output canvas size for a single cell.
 * Width is always CELL_OUTPUT_WIDTH (1080px); height derived from ratio.
 */
export function computeCellOutputSize(
  cellRatioW: number,
  cellRatioH: number,
): { width: number; height: number } {
  return {
    width: CELL_OUTPUT_WIDTH,
    height: Math.round(CELL_OUTPUT_WIDTH * (cellRatioH / cellRatioW)),
  }
}

/**
 * Given the crop area in original image pixels and the grid dimensions,
 * return the source rectangle for each cell in row-major order
 * (top-left → top-right → next row...).
 */
export function computeCellSourceRegions(
  cropPixels: CropPixels,
  rows: number,
  cols: number,
): CropPixels[] {
  const cellW = cropPixels.width / cols
  const cellH = cropPixels.height / rows
  const regions: CropPixels[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      regions.push({
        x: cropPixels.x + c * cellW,
        y: cropPixels.y + r * cellH,
        width: cellW,
        height: cellH,
      })
    }
  }

  return regions
}
