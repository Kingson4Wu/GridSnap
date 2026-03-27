import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildShareUrl, copyToClipboard, APP_URL } from './shareApp'

describe('APP_URL', () => {
  it('is the GitHub Pages URL', () => {
    expect(APP_URL).toBe('https://kingson4wu.github.io/GridSnap/')
  })
})

describe('buildShareUrl', () => {
  it('x: builds twitter intent URL with encoded text and url', () => {
    const url = buildShareUrl('x', 'hello world')
    expect(url).toContain('twitter.com/intent/tweet')
    expect(url).toContain(encodeURIComponent('hello world'))
    expect(url).toContain(encodeURIComponent(APP_URL))
  })

  it('whatsapp: builds wa.me URL with combined text and url', () => {
    const url = buildShareUrl('whatsapp', 'hello world')
    expect(url).toContain('wa.me')
    expect(url).toContain(encodeURIComponent('hello world'))
    expect(url).toContain(encodeURIComponent(APP_URL))
  })

  it('telegram: builds t.me URL with url and text params', () => {
    const url = buildShareUrl('telegram', 'hello world')
    expect(url).toContain('t.me/share/url')
    expect(url).toContain(encodeURIComponent(APP_URL))
    expect(url).toContain(encodeURIComponent('hello world'))
  })
})

describe('copyToClipboard', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
      writable: true,
    })
  })

  it('calls navigator.clipboard.writeText with the given text', async () => {
    await copyToClipboard('https://example.com')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com')
  })
})
