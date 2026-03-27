import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveToGallery } from './saveToGallery'

const makeBlobs = (n: number) =>
  Array.from({ length: n }, (_, i) => new Blob([`img${i}`], { type: 'image/jpeg' }))

describe('saveToGallery — Web Share API path', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      share: vi.fn().mockResolvedValue(undefined),
      canShare: vi.fn().mockReturnValue(true),
    })
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:fake'),
      revokeObjectURL: vi.fn(),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls navigator.share with File array when available', async () => {
    const blobs = makeBlobs(3)
    await saveToGallery(blobs)
    expect(navigator.share).toHaveBeenCalledOnce()
    const arg = (navigator.share as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(arg.files).toHaveLength(3)
    expect(arg.files[0]).toBeInstanceOf(File)
    expect(arg.files[0].name).toBe('gridsnap-1.jpg')
  })
})

describe('saveToGallery — download fallback path', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {})
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:fake'),
      revokeObjectURL: vi.fn(),
    })
    const anchor = { href: '', download: 'x', click: vi.fn(), style: { display: '' } }
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLElement)
    vi.spyOn(document.body, 'appendChild').mockImplementation(el => el)
    vi.spyOn(document.body, 'removeChild').mockImplementation(el => el)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('creates one anchor per blob when share API unavailable', async () => {
    const blobs = makeBlobs(2)
    await saveToGallery(blobs)
    expect(document.createElement).toHaveBeenCalledWith('a')
  })
})
