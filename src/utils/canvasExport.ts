import type { CropPixels, AspectRatio, GridLayout } from '../types'
import { computeCellSourceRegions, computeCellOutputSize } from './geometry'

/**
 * Render each grid cell from the source image into a separate Blob.
 * Returns Blobs in row-major order (same order as computeCellSourceRegions).
 */
export async function exportCells(
  imageSrc: string,
  cropPixels: CropPixels,
  layout: GridLayout,
  ratio: AspectRatio,
): Promise<Blob[]> {
  const image = await loadImage(imageSrc)
  const regions = computeCellSourceRegions(cropPixels, layout.rows, layout.cols)
  const { width: outW, height: outH } = computeCellOutputSize(ratio.width, ratio.height)

  const blobs: Blob[] = []

  for (const region of regions) {
    const canvas = document.createElement('canvas')
    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    ctx.drawImage(
      image,
      region.x,
      region.y,
      region.width,
      region.height,
      0,
      0,
      outW,
      outH,
    )

    const blob = await canvasToBlob(canvas)
    blobs.push(blob)
  }

  return blobs
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('toBlob returned null'))),
      'image/jpeg',
      0.92,
    )
  })
}
