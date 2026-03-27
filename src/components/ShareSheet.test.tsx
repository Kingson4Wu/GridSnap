import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShareSheet } from './ShareSheet'

describe('ShareSheet', () => {
  it('renders nothing when open=false', () => {
    const { container } = render(<ShareSheet open={false} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the sheet when open=true', () => {
    render(<ShareSheet open={true} onClose={() => {}} />)
    expect(screen.getByText('Share GridSnap')).toBeInTheDocument()
  })

  it('shows X, WhatsApp, Telegram labels', () => {
    render(<ShareSheet open={true} onClose={() => {}} />)
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Telegram')).toBeInTheDocument()
  })

  it('shows Copy button', () => {
    render(<ShareSheet open={true} onClose={() => {}} />)
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<ShareSheet open={true} onClose={onClose} />)
    const backdrop = document.querySelector('[data-testid="sheet-backdrop"]')!
    await userEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows Copied! after Copy is clicked', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
      writable: true,
    })
    render(<ShareSheet open={true} onClose={() => {}} />)
    await userEvent.click(screen.getByText('Copy'))
    expect(screen.getByText('Copied!')).toBeInTheDocument()
  })
})
