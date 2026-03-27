import { describe, it, expect } from 'vitest'
import { GRID_LAYOUTS, ASPECT_RATIOS } from './constants'

describe('GRID_LAYOUTS', () => {
  it('has 6 layouts', () => {
    expect(GRID_LAYOUTS).toHaveLength(6)
  })
  it('each layout has rows, cols, id, label', () => {
    for (const layout of GRID_LAYOUTS) {
      expect(layout.id).toBeTruthy()
      expect(layout.rows).toBeGreaterThan(0)
      expect(layout.cols).toBeGreaterThan(0)
      expect(layout.label).toBeTruthy()
    }
  })
  it('contains 3x3, 2x2, 1x2, 1x3, 1x4, 2x3', () => {
    const ids = GRID_LAYOUTS.map(l => l.id)
    expect(ids).toContain('3x3')
    expect(ids).toContain('2x2')
    expect(ids).toContain('1x2')
    expect(ids).toContain('1x3')
    expect(ids).toContain('1x4')
    expect(ids).toContain('2x3')
  })
})

describe('ASPECT_RATIOS', () => {
  it('has 4 ratios', () => {
    expect(ASPECT_RATIOS).toHaveLength(4)
  })
  it('includes square 1:1', () => {
    const square = ASPECT_RATIOS.find(r => r.id === 'square')
    expect(square).toBeDefined()
    expect(square!.width).toBe(1)
    expect(square!.height).toBe(1)
  })
})
