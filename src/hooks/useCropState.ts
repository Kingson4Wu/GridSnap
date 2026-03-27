import { useState, useCallback } from 'react'
import type { Point, CropPixels } from '../types'

export function useCropState() {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropPixels, setCropPixels] = useState<CropPixels | null>(null)

  const onCropChange = useCallback((c: Point) => setCrop(c), [])
  const onZoomChange = useCallback((z: number) => setZoom(z), [])
  const onCropComplete = useCallback((_: unknown, pixels: CropPixels) => {
    setCropPixels(pixels)
  }, [])

  const reset = useCallback(() => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCropPixels(null)
  }, [])

  return { crop, zoom, cropPixels, onCropChange, onZoomChange, onCropComplete, reset }
}
