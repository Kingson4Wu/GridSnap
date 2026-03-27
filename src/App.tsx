import { useState, useCallback, type ReactNode } from 'react'
import { Header } from './components/Header'
import { ImagePicker } from './components/ImagePicker'
import { CropArea } from './components/CropArea'
import { GridSelector } from './components/GridSelector'
import { RatioSelector } from './components/RatioSelector'
import { SaveButton } from './components/SaveButton'
import { useCropState } from './hooks/useCropState'
import { exportCells } from './utils/canvasExport'
import { saveToGallery } from './utils/saveToGallery'
import { GRID_LAYOUTS, ASPECT_RATIOS } from './constants'
import type { GridLayout, AspectRatio } from './types'
import { t } from './i18n'
import { ShareSheet } from './components/ShareSheet'

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [layout, setLayout] = useState<GridLayout>(GRID_LAYOUTS[0])
  const [ratio, setRatio] = useState<AspectRatio>(ASPECT_RATIOS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [rotation, setRotation] = useState(0)

  const { crop, zoom, cropPixels, onCropChange, onZoomChange, onCropComplete, reset } =
    useCropState()

  const handleImageSelected = useCallback(
    (dataUrl: string) => {
      setImageSrc(dataUrl)
      setError(null)
      setRotation(0)
      reset()
    },
    [reset],
  )

  const handleLayoutChange = useCallback(
    (newLayout: GridLayout) => {
      setLayout(newLayout)
      reset()
    },
    [reset],
  )

  const handleRatioChange = useCallback(
    (newRatio: AspectRatio) => {
      setRatio(newRatio)
      reset()
    },
    [reset],
  )

  const handleSave = useCallback(async () => {
    if (!imageSrc || !cropPixels) return
    setLoading(true)
    setError(null)
    try {
      const blobs = await exportCells(imageSrc, cropPixels, layout, ratio, rotation)
      await saveToGallery(blobs)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveFailed)
    } finally {
      setLoading(false)
    }
  }, [imageSrc, cropPixels, layout, ratio, rotation])

  return (
    <div className="h-dvh bg-[#0f0f23] text-white flex flex-col max-w-lg mx-auto overflow-hidden">
      <Header onShareClick={() => setShareOpen(true)} />

      {!imageSrc ? (
        <main className="flex-1 p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {t.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border border-[#e94560] bg-[#e94560]/15 text-[#e94560] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-sm text-white/55">{step}</span>
              </div>
            ))}
          </div>
          <hr className="border-white/10" />
          <ImagePicker onImageSelected={handleImageSelected} />
        </main>
      ) : (
        <>
          <div className="flex-1 relative overflow-hidden">
            <CropArea
              imageSrc={imageSrc}
              layout={layout}
              ratio={ratio}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
            />
            <RotateButton side="left" aria-label="Rotate counterclockwise" onClick={() => setRotation(r => (r + 270) % 360)}>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </RotateButton>
            <RotateButton side="right" aria-label="Rotate clockwise" onClick={() => setRotation(r => (r + 90) % 360)}>
              <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </RotateButton>
            <button
              type="button"
              onClick={() => { setImageSrc(null); setRotation(0); reset() }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/70 hover:text-white bg-black/50 border border-white/20 hover:border-white/40 rounded-full px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              {t.changePhoto}
            </button>
          </div>

          <div
            className="flex-none border-t border-white/10 px-3 pt-3 bg-[#0f0f23]"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            {error && <p className="text-red-400 text-xs text-center mb-2">{error}</p>}
            <GridSelector selected={layout} onChange={handleLayoutChange} />
            <div className="flex items-center justify-between mt-2">
              <RatioSelector selected={ratio} onChange={handleRatioChange} />
              <SaveButton disabled={!cropPixels} loading={loading} onClick={handleSave} />
            </div>
          </div>
        </>
      )}
      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  )
}

function RotateButton({ side, onClick, children, ...rest }: {
  side: 'left' | 'right'
  onClick: () => void
  children: ReactNode
  'aria-label': string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-2 ${side === 'left' ? 'left-2' : 'right-2'} w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors`}
      {...rest}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  )
}
