import { GRID_LAYOUTS } from '../constants'
import type { GridLayout } from '../types'

interface Props {
  selected: GridLayout
  onChange: (layout: GridLayout) => void
}

export function GridSelector({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {GRID_LAYOUTS.map(layout => (
        <button
          key={layout.id}
          type="button"
          onClick={() => onChange(layout)}
          className={`flex-none p-2 rounded-lg border transition-colors ${
            selected.id === layout.id
              ? 'border-[#e94560] bg-[#e94560]/10'
              : 'border-white/10 bg-white/5'
          }`}
        >
          <GridIcon rows={layout.rows} cols={layout.cols} active={selected.id === layout.id} />
        </button>
      ))}
    </div>
  )
}

function GridIcon({ rows, cols, active }: { rows: number; cols: number; active: boolean }) {
  const color = active ? '#e94560' : 'rgba(255,255,255,0.3)'
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '2px',
        width: '36px',
        height: `${Math.max(24, 36 * rows / cols)}px`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} style={{ background: color, borderRadius: '1px' }} />
      ))}
    </div>
  )
}
