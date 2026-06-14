import { describe, expect, it } from 'vitest'
import { BeatDetector, type BeatResult } from './beatDetector'

const DT = 1 / 60

const TEST_OPTS = {
  historySize: 30,
  minHistory: 5,
  thresholdMultiplier: 1.4,
  minIntervalMs: 120,
  minEnergy: 0.04,
}

function feed(detector: BeatDetector, value: number, frames: number): BeatResult {
  let last: BeatResult = { beat: false, energy: 0 }
  for (let i = 0; i < frames; i++) last = detector.update(value, DT)
  return last
}

describe('BeatDetector', () => {
  it('fires on an energy spike after steady low energy', () => {
    const detector = new BeatDetector(TEST_OPTS)
    feed(detector, 0.1, 10)
    const result = detector.update(0.8, DT)
    expect(result.beat).toBe(true)
    expect(result.energy).toBeGreaterThan(0)
  })

  it('does not double-fire within the refractory interval', () => {
    const detector = new BeatDetector(TEST_OPTS)
    feed(detector, 0.1, 10)
    expect(detector.update(0.8, DT).beat).toBe(true)
    expect(detector.update(0.8, DT).beat).toBe(false) // ~16ms later
  })

  it('fires again once the refractory interval has passed', () => {
    const detector = new BeatDetector(TEST_OPTS)
    feed(detector, 0.1, 10)
    expect(detector.update(0.8, DT).beat).toBe(true)
    feed(detector, 0.1, 12) // ~200ms of low energy
    expect(detector.update(0.8, DT).beat).toBe(true)
  })

  it('never fires on silence', () => {
    const detector = new BeatDetector(TEST_OPTS)
    const result = feed(detector, 0, 60)
    expect(result.beat).toBe(false)
  })

  it('does not fire below the energy floor even on a big relative spike', () => {
    const detector = new BeatDetector(TEST_OPTS)
    feed(detector, 0.001, 10)
    const result = detector.update(0.03, DT) // 30x the average, but under minEnergy
    expect(result.beat).toBe(false)
  })
})
