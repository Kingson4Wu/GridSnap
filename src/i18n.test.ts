import { describe, it, expect } from 'vitest'
import { t } from './i18n'

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
