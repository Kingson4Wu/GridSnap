import { useState } from 'react'
import { t } from '../i18n'
import { buildShareUrl, copyToClipboard, shareViaWebShare, APP_URL } from '../utils/shareApp'

interface Props {
  open: boolean
  onClose: () => void
}

export function ShareSheet({ open, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  if (!open) return null

  async function handleCopy() {
    await copyToClipboard(APP_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePlatform(platform: 'x' | 'whatsapp' | 'telegram') {
    window.open(buildShareUrl(platform, t.shareText), '_blank')
  }

  async function handleMore() {
    try {
      await shareViaWebShare('GridSnap', t.shareText)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      throw err
    }
  }

  return (
    <div
      data-testid="sheet-backdrop"
      className="fixed inset-0 z-50 flex items-end"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-auto bg-[#1a1a35] rounded-t-2xl border-t border-white/10 px-4 pt-3 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />
        <p className="text-xs text-white/40 text-center uppercase tracking-widest mb-4">
          {t.shareTitle}
        </p>

        <div className="flex justify-center gap-6 mb-4">
          {(['x', 'whatsapp', 'telegram'] as const).map(platform => (
            <button
              key={platform}
              type="button"
              onClick={() => handlePlatform(platform)}
              className="flex flex-col items-center gap-1"
            >
              <PlatformIcon platform={platform} />
              <span className="text-xs text-white/40">
                {platform === 'x' ? 'X' : platform === 'whatsapp' ? 'WhatsApp' : 'Telegram'}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 mb-3">
          <span className="text-xs text-white/35 font-mono truncate flex-1 mr-3">
            {APP_URL.replace('https://', '')}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-semibold flex-none text-[#e94560]"
          >
            {copied ? t.copied : t.copyLink}
          </button>
        </div>

        {typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleMore}
            className="w-full flex items-center justify-center gap-2 border border-white/10 rounded-xl py-3 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            {t.moreOptions}
          </button>
        )}
      </div>
    </div>
  )
}

function PlatformIcon({ platform }: { platform: 'x' | 'whatsapp' | 'telegram' }) {
  if (platform === 'x') {
    return (
      <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-white font-bold text-lg">
        𝕏
      </div>
    )
  }
  if (platform === 'whatsapp') {
    return (
      <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-xl">
        💬
      </div>
    )
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-[#2CA5E0] flex items-center justify-center text-xl">
      ✈️
    </div>
  )
}
