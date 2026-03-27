import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { t } from './i18n'
import App from './App'

describe('t.steps', () => {
  it('has exactly 3 steps', () => {
    expect(t.steps).toHaveLength(3)
  })

  it('each step is a non-empty string', () => {
    for (const step of t.steps) {
      expect(typeof step).toBe('string')
      expect(step.length).toBeGreaterThan(0)
    }
  })
})

describe('Home empty state', () => {
  it('shows all 3 onboarding steps before image is selected', () => {
    render(<App />)
    for (const step of t.steps) {
      expect(screen.getByText(step)).toBeInTheDocument()
    }
  })
})

describe('share strings', () => {
  it('has all 5 share keys as non-empty strings', () => {
    for (const key of ['shareTitle', 'shareText', 'copyLink', 'copied', 'moreOptions'] as const) {
      expect(typeof t[key]).toBe('string')
      expect((t[key] as string).length).toBeGreaterThan(0)
    }
  })
})
