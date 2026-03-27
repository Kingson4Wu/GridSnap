import Cropper from 'react-easy-crop'
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

  return (
    <div className="relative w-full" style={{ height: '60vw', maxHeight: '360px' }}>
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
      <GridOverlay rows={layout.rows} cols={layout.cols} />
    </div>
  )
}

function GridOverlay({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div
          key={i}
          style={{ border: '1px solid rgba(255,255,255,0.4)' }}
        />
      ))}
    </div>
  )
}
