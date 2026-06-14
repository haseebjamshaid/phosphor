import { describe, expect, it } from 'vitest'
import type { VisualizerConfig } from '../config/schema'
import { computeTargets } from './reactivity'

const base: VisualizerConfig['reactivity'] = {
  bassTarget: 'scale',
  midTarget: 'color',
  trebleTarget: 'displacement',
  sensitivity: 1,
  smoothing: 0.8,
  beatSensitivity: 0.5,
}

const frame = { bass: 0.5, mid: 0.4, treble: 0.3 }

describe('computeTargets', () => {
  it('routes each band to its configured target', () => {
    expect(computeTargets(frame, base)).toEqual({
      scale: 0.5,
      color: 0.4,
      displacement: 0.3,
      rotation: 0,
    })
  })

  it('scales everything by sensitivity', () => {
    const result = computeTargets(frame, { ...base, sensitivity: 2 })
    expect(result.scale).toBeCloseTo(1.0)
    expect(result.color).toBeCloseTo(0.8)
  })

  it('contributes nothing when targets are none', () => {
    const result = computeTargets(frame, {
      ...base,
      bassTarget: 'none',
      midTarget: 'none',
      trebleTarget: 'none',
    })
    expect(result).toEqual({ scale: 0, color: 0, displacement: 0, rotation: 0 })
  })

  it('accumulates bands that share a target', () => {
    const result = computeTargets(frame, {
      ...base,
      bassTarget: 'scale',
      midTarget: 'scale',
      trebleTarget: 'scale',
    })
    expect(result.scale).toBeCloseTo(1.2)
  })
})
