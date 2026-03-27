export const APP_URL = 'https://kingson4wu.github.io/GridSnap/'

export function buildShareUrl(
  platform: 'x' | 'whatsapp' | 'telegram',
  text: string,
): string {
  const enc = encodeURIComponent
  switch (platform) {
    case 'x':
      return `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(APP_URL)}`
    case 'whatsapp':
      return `https://wa.me/?text=${enc(text + ' ' + APP_URL)}`
    case 'telegram':
      return `https://t.me/share/url?url=${enc(APP_URL)}&text=${enc(text)}`
    default: {
      const _exhaustive: never = platform
      throw new Error(`Unsupported platform: ${_exhaustive}`)
    }
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  // Fallback for browsers without Clipboard API
  const el = document.createElement('textarea')
  el.value = text
  el.style.cssText = 'position:fixed;opacity:0'
  document.body.appendChild(el)
  el.focus()
  el.select()
  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(el)
  }
}

export async function shareViaWebShare(title: string, text: string): Promise<void> {
  await navigator.share({ title, text, url: APP_URL })
}
