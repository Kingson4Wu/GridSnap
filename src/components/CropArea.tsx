import Cropper from 'react-easy-crop'
import { useRef, useCallback, useLayoutEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { GridLayout, AspectRatio, Point, CropPixels } from '../types'
import { computeGridAspect } from '../utils/geometry'

interface Props {
  imageSrc: string
  layout: GridLayout
  ratio: AspectRatio
  crop: Point
  zoom: number
  onCropChange: (crop: Point) => void
  onZoomChange: (zoom: number) => void
  onCropComplete: (croppedArea: unknown, croppedAreaPixels: CropPixels) => void
}

export function CropArea({
  imageSrc,
  layout,
  ratio,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
}: Props) {
  const aspect = computeGridAspect(layout.rows, layout.cols, ratio.width, ratio.height)
  const containerRef = useRef<HTMLDivElement>(null)
  const [overlayStyle, setOverlayStyle] = useState<CSSProperties>({ display: 'none' })

  // Compute the actual crop box size/position within the container.
  // react-easy-crop sizes the crop box to fill the limiting dimension
  // (width or height) while preserving `aspect`. The overlay must match.
  const updateOverlay = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    if (width === 0 || height === 0) return

    let boxW: number, boxH: number
    if (width / height > aspect) {
      // Container is wider than crop box → height-limited
      boxH = height
      boxW = height * aspect
    } else {
      // Container is taller than crop box → width-limited
      boxW = width
      boxH = width / aspect
    }

    setOverlayStyle({
      position: 'absolute',
      width: `${boxW}px`,
      height: `${boxH}px`,
      left: `${(width - boxW) / 2}px`,
      top: `${(height - boxH) / 2}px`,
      pointerEvents: 'none',
    })
  }, [aspect])

  useLayoutEffect(() => {
    updateOverlay()
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(updateOverlay)
    ro.observe(el)
    return () => ro.disconnect()
  }, [updateOverlay])

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '60vw', maxHeight: '360px' }}>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete as (a: unknown, b: unknown) => void}
        showGrid={false}
        style={{
          containerStyle: { borderRadius: '12px', overflow: 'hidden' },
        }}
      />
      <div
        style={{
          ...overlayStyle,
          display: 'grid',
          gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
          gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
        }}
      >
        {Array.from({ length: layout.rows * layout.cols }).map((_, i) => (
          <div key={i} style={{ border: '1px solid rgba(255,255,255,0.4)' }} />
        ))}
      </div>
    </div>
  )
}
