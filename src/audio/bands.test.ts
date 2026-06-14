import { describe, expect, it } from 'vitest'
import { computeLevel, reduceBands } from './bands'

const SAMPLE_RATE = 48000
const FFT_SIZE = 2048
const BIN_COUNT = FFT_SIZE / 2 // 1024
const HZ_PER_BIN = SAMPLE_RATE / FFT_SIZE // 23.4375 Hz

/** Bin index covering a given frequency. */
function binForHz(hz: number): number {
  return Math.round(hz / HZ_PER_BIN)
}

describe('reduceBands', () => {
  it('returns all zeros for a silent spectrum', () => {
    const freq = new Uint8Array(BIN_COUNT)
    const bands = reduceBands(freq, SAMPLE_RATE, FFT_SIZE)
    expect(bands).toEqual({ bass: 0, mid: 0, treble: 0 })
  })

  it('routes low-frequency energy to the bass band only', () => {
    const freq = new Uint8Array(BIN_COUNT)
    freq[binForHz(60)] = 255 // ~60 Hz → bass
    const { bass, mid, treble } = reduceBands(freq, SAMPLE_RATE, FFT_SIZE)
    expect(bass).toBeGreaterThan(0)
    expect(mid).toBe(0)
    expect(treble).toBe(0)
  })

  it('routes high-frequency energy to the treble band only', () => {
    const freq = new Uint8Array(BIN_COUNT)
    freq[binForHz(5000)] = 255 // ~5 kHz → treble
    const { bass, mid, treble } = reduceBands(freq, SAMPLE_RATE, FFT_SIZE)
    expect(treble).toBeGreaterThan(0)
    expect(bass).toBe(0)
    expect(mid).toBe(0)
  })

  it('normalizes a fully-saturated band to 1', () => {
    const freq = new Uint8Array(BIN_COUNT).fill(255)
    const { bass, mid, treble } = reduceBands(freq, SAMPLE_RATE, FFT_SIZE)
    expect(bass).toBeCloseTo(1, 5)
    expect(mid).toBeCloseTo(1, 5)
    expect(treble).toBeCloseTo(1, 5)
  })
})

describe('computeLevel', () => {
  it('returns 0 for a centered (silent) waveform', () => {
    const time = new Uint8Array(64).fill(128)
    expect(computeLevel(time)).toBe(0)
  })

  it('returns ~1 for a full-swing square wave', () => {
    const time = new Uint8Array(64)
    for (let i = 0; i < time.length; i++) time[i] = i % 2 === 0 ? 0 : 255
    expect(computeLevel(time)).toBeGreaterThan(0.98)
  })
})
