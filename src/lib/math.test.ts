import { describe, expect, it } from 'vitest'
import { clamp, clamp01, expSmooth, lerp, mean, smoothstep } from './math'

describe('clamp', () => {
  it('clamps above the max', () => {
    expect(clamp(5, 0, 1)).toBe(1)
  })

  it('clamps below the min', () => {
    expect(clamp(-3, 0, 10)).toBe(0)
  })

  it('passes values within range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
})

describe('clamp01', () => {
  it('clamps to the [0, 1] range', () => {
    expect(clamp01(2)).toBe(1)
    expect(clamp01(-1)).toBe(0)
    expect(clamp01(0.42)).toBe(0.42)
  })
})

describe('lerp', () => {
  it('interpolates between endpoints', () => {
    expect(lerp(0, 10, 0)).toBe(0)
    expect(lerp(0, 10, 1)).toBe(10)
    expect(lerp(0, 10, 0.5)).toBe(5)
  })
})

describe('mean', () => {
  it('returns 0 for an empty array', () => {
    expect(mean([])).toBe(0)
  })

  it('averages the values', () => {
    expect(mean([2, 4])).toBe(3)
  })
})

describe('smoothstep', () => {
  it('is 0 at or below edge0 and 1 at or above edge1', () => {
    expect(smoothstep(0.1, 0.3, 0.05)).toBe(0)
    expect(smoothstep(0.1, 0.3, 0.4)).toBe(1)
  })

  it('is 0.5 at the midpoint', () => {
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5, 5)
  })

  it('eases (below linear in the first half)', () => {
    expect(smoothstep(0, 1, 0.25)).toBeLessThan(0.25)
  })
})

describe('expSmooth', () => {
  it('returns the current value when delta is 0', () => {
    expect(expSmooth(0.3, 1, 0.06, 0)).toBe(0.3)
  })

  it('snaps to target when half-life is 0', () => {
    expect(expSmooth(0.3, 1, 0, 0.016)).toBe(1)
  })

  it('moves halfway in exactly one half-life', () => {
    expect(expSmooth(0, 1, 0.06, 0.06)).toBeCloseTo(0.5, 5)
  })

  it('approaches the target over a long delta', () => {
    expect(expSmooth(0, 1, 0.06, 10)).toBeGreaterThan(0.99)
  })
})
