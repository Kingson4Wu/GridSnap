import { ASPECT_RATIOS } from '../constants'
import type { AspectRatio } from '../types'

interface Props {
  selected: AspectRatio
  onChange: (ratio: AspectRatio) => void
}

export function RatioSelector({ selected, onChange }: Props) {
  return (
    <div className="w-full">
      <p className="text-xs text-white/40 mb-2 px-1">每格比例</p>
      <div className="flex gap-2">
        {ASPECT_RATIOS.map(ratio => (
          <button
            key={ratio.id}
            type="button"
            onClick={() => onChange(ratio)}
            className={`flex-none flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
              selected.id === ratio.id
                ? 'border-[#e94560] bg-[#e94560]/10 text-[#e94560]'
                : 'border-white/10 bg-white/5 text-white/50'
            }`}
          >
            <RatioBox width={ratio.width} height={ratio.height} active={selected.id === ratio.id} />
            <span className="text-xs">{ratio.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RatioBox({ width, height, active }: { width: number; height: number; active: boolean }) {
  const maxDim = 28
  const scale = maxDim / Math.max(width, height)
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)
  return (
    <div
      style={{ width: `${w}px`, height: `${h}px` }}
      className={`border rounded-sm ${active ? 'border-[#e94560]' : 'border-white/30'}`}
    />
  )
}
