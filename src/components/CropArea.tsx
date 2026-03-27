import Cropper from 'react-easy-crop'
import { useRef, useCallback, useLayoutEffect, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { GridLayout, AspectRatio, Point, CropPixels } from '../types'
import { computeGridAspect } from '../utils/geometry'

interface Props {
  imageSrc: string
  layout: GridLayout
  ratio: AspectRatio
  crop: Point
  zoom: number
  rotation: number
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
  rotation,
  onCropChange,
  onZoomChange,
  onCropComplete,
}: Props) {
  const aspect = computeGridAspect(layout.rows, layout.cols, ratio.width, ratio.height)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const [overlayStyle, setOverlayStyle] = useState<CSSProperties>({ display: 'none' })

  // Read the crop area dimensions directly from the DOM element that
  // react-easy-crop renders. This is more reliable than computing it ourselves
  // because react-easy-crop may apply internal offsets we don't know about.
  const syncOverlay = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const container = containerRef.current
      if (!container) return
      const cropEl = container.querySelector('[class*="CropArea"]') as HTMLElement | null
      if (!cropEl) return
      const cRect = container.getBoundingClientRect()
      const eRect = cropEl.getBoundingClientRect()
      if (eRect.width === 0 || eRect.height === 0) return
      setOverlayStyle({
        position: 'absolute',
        left: `${eRect.left - cRect.left}px`,
        top: `${eRect.top - cRect.top}px`,
        width: `${eRect.width}px`,
        height: `${eRect.height}px`,
        pointerEvents: 'none',
      })
    })
  }, [])

  // Watch for container resize and for react-easy-crop inserting/resizing
  // the crop area element (happens after image loads or aspect changes).
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ro = new ResizeObserver(syncOverlay)
    ro.observe(container)

    // MutationObserver catches when react-easy-crop sets inline style on
    // the crop area div (e.g. after image load changes cropSize).
    const mo = new MutationObserver(syncOverlay)
    mo.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] })

    return () => {
      ro.disconnect()
      mo.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [syncOverlay])

  // Re-sync when aspect changes (grid layout or ratio switch).
  useEffect(() => {
    syncOverlay()
  }, [aspect, syncOverlay])

  const isOverlayReady = overlayStyle.display !== 'none' && overlayStyle.width !== undefined

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        aspect={aspect}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete as (a: unknown, b: unknown) => void}
        showGrid={false}
        style={{
          containerStyle: { borderRadius: '12px', overflow: 'hidden' },
        }}
      />
      {isOverlayReady && (
        <div
          data-testid="grid-overlay"
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
      )}
    </div>
  )
}
