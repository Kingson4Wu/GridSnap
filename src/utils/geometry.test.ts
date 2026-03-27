import { describe, it, expect } from 'vitest'
import { computeGridAspect, computeCellOutputSize, computeCellSourceRegions } from './geometry'

describe('computeGridAspect', () => {
  it('returns 1 for 3x3 square cells', () => {
    expect(computeGridAspect(3, 3, 1, 1)).toBeCloseTo(1)
  })
  it('returns 3 for 1x3 square cells', () => {
    expect(computeGridAspect(1, 3, 1, 1)).toBeCloseTo(3)
  })
  it('returns correct ratio for 2x3 portrait 4:5 cells', () => {
    // (cols/rows) * (cellW/cellH) = (3/2) * (4/5) = 1.2
    expect(computeGridAspect(2, 3, 4, 5)).toBeCloseTo(1.2)
  })
})

describe('computeCellOutputSize', () => {
  it('returns 1080x1080 for square', () => {
    expect(computeCellOutputSize(1, 1)).toEqual({ width: 1080, height: 1080 })
  })
  it('returns 1080x1350 for 4:5', () => {
    expect(computeCellOutputSize(4, 5)).toEqual({ width: 1080, height: 1350 })
  })
  it('returns 1080x1920 for 9:16', () => {
    expect(computeCellOutputSize(9, 16)).toEqual({ width: 1080, height: 1920 })
  })
})

describe('computeCellSourceRegions', () => {
  const cropPixels = { x: 10, y: 20, width: 300, height: 300 }

  it('returns 9 regions for 3x3', () => {
    const regions = computeCellSourceRegions(cropPixels, 3, 3)
    expect(regions).toHaveLength(9)
  })

  it('returns regions in row-major order (top-left first)', () => {
    const regions = computeCellSourceRegions(cropPixels, 3, 3)
    expect(regions[0]).toEqual({ x: 10, y: 20, width: 100, height: 100 })
    expect(regions[1]).toEqual({ x: 110, y: 20, width: 100, height: 100 })
    expect(regions[3]).toEqual({ x: 10, y: 120, width: 100, height: 100 })
  })

  it('handles 1x3 (horizontal panoramic)', () => {
    const wide = { x: 0, y: 0, width: 900, height: 300 }
    const regions = computeCellSourceRegions(wide, 1, 3)
    expect(regions).toHaveLength(3)
    expect(regions[0]).toEqual({ x: 0,   y: 0, width: 300, height: 300 })
    expect(regions[1]).toEqual({ x: 300, y: 0, width: 300, height: 300 })
    expect(regions[2]).toEqual({ x: 600, y: 0, width: 300, height: 300 })
  })
})
