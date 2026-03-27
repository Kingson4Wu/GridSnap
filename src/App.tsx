import { useState, useCallback } from 'react'
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

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [layout, setLayout] = useState<GridLayout>(GRID_LAYOUTS[0])
  const [ratio, setRatio] = useState<AspectRatio>(ASPECT_RATIOS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { crop, zoom, cropPixels, onCropChange, onZoomChange, onCropComplete, reset } =
    useCropState()

  const handleImageSelected = useCallback(
    (dataUrl: string) => {
      setImageSrc(dataUrl)
      setError(null)
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
      const blobs = await exportCells(imageSrc, cropPixels, layout, ratio)
      await saveToGallery(blobs)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }, [imageSrc, cropPixels, layout, ratio])

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col max-w-lg mx-auto">
      <Header />

      <main className="flex-1 flex flex-col gap-4 p-4">
        <div className="w-full">
          {imageSrc ? (
            <div className="flex flex-col gap-2">
              <CropArea
                imageSrc={imageSrc}
                layout={layout}
                ratio={ratio}
                crop={crop}
                zoom={zoom}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
              />
              <button
                type="button"
                onClick={() => { setImageSrc(null); reset() }}
                className="text-xs text-white/30 hover:text-white/60 text-center py-1"
              >
                重新选取图片
              </button>
            </div>
          ) : (
            <ImagePicker onImageSelected={handleImageSelected} />
          )}
        </div>

        {imageSrc && (
          <>
            <GridSelector selected={layout} onChange={handleLayoutChange} />
            <RatioSelector selected={ratio} onChange={handleRatioChange} />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <SaveButton
              disabled={!cropPixels}
              loading={loading}
              onClick={handleSave}
            />
          </>
        )}
      </main>
    </div>
  )
}
