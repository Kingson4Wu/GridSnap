import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

describe('Header', () => {
  it('renders GridSnap title', () => {
    render(<Header onShareClick={() => {}} />)
    expect(screen.getByText('GridSnap')).toBeInTheDocument()
  })

  it('calls onShareClick when share button is clicked', async () => {
    const onShareClick = vi.fn()
    render(<Header onShareClick={onShareClick} />)
    await userEvent.click(screen.getByRole('button', { name: /share/i }))
    expect(onShareClick).toHaveBeenCalledOnce()
  })
})
