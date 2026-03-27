import { useRef } from 'react'
import { t } from '../i18n'

interface Props {
  onImageSelected: (dataUrl: string) => void
}

export function ImagePicker({ onImageSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const result = ev.target?.result
      if (typeof result === 'string') onImageSelected(result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex flex-col items-center justify-center gap-2 w-full h-full min-h-48 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:border-white/40 hover:text-white/70 transition-colors"
    >
      <span className="text-4xl">📷</span>
      <span className="text-sm">{t.selectPhoto}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </button>
  )
}
