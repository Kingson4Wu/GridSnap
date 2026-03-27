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
  rotation = 0,
): Promise<Blob[]> {
  const image = await loadImage(imageSrc)
  const source = rotation === 0 ? image : rotateImageToCanvas(image, rotation)
  const regions = computeCellSourceRegions(cropPixels, layout.rows, layout.cols)
  const { width: outW, height: outH } = computeCellOutputSize(ratio.width, ratio.height)

  return Promise.all(
    regions.map(region => {
      const canvas = document.createElement('canvas')
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas 2D context unavailable')
      ctx.drawImage(source, region.x, region.y, region.width, region.height, 0, 0, outW, outH)
      return canvasToBlob(canvas)
    }),
  )
}

/** Draws image rotated by `rotation` degrees (90/180/270) onto a new canvas. */
function rotateImageToCanvas(img: HTMLImageElement, rotation: number): HTMLCanvasElement {
  const swap = rotation === 90 || rotation === 270
  const canvas = document.createElement('canvas')
  canvas.width = swap ? img.height : img.width
  canvas.height = swap ? img.width : img.height
  const ctx = canvas.getContext('2d')!
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(img, -img.width / 2, -img.height / 2)
  return canvas
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
