/**
 * Save an array of JPEG Blobs to the device photo library.
 *
 * iOS (Safari 15+): uses Web Share API — shows native share sheet,
 *   user taps "存储到照片图库".
 * Android / desktop: triggers programmatic anchor download per blob.
 * Fallback (old iOS): opens each blob in a new tab for manual long-press save.
 */
export async function saveToGallery(blobs: Blob[]): Promise<void> {
  const files = blobs.map(
    (blob, i) => new File([blob], `gridsnap-${i + 1}.jpg`, { type: 'image/jpeg' }),
  )

  if (navigator.canShare && navigator.canShare({ files }) && navigator.share) {
    await navigator.share({ files, title: 'GridSnap' })
    return
  }

  // Android / desktop: programmatic download
  if (supportsDownload()) {
    for (const file of files) {
      downloadFile(file)
      await delay(200)
    }
    return
  }

  // Fallback: open in new tab
  for (const file of files) {
    const url = URL.createObjectURL(file)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }
}

function supportsDownload(): boolean {
  const a = document.createElement('a')
  return typeof a.download !== 'undefined'
}

function downloadFile(file: File): void {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 5_000)
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
