import { BAND_RANGES } from '../lib/constants'

export interface Bands {
  bass: number
  mid: number
  treble: number
}

/** Average the FFT magnitude bins covering [lowHz, highHz], normalized to 0..1. */
function averageRange(
  freq: Uint8Array,
  lowHz: number,
  highHz: number,
  hzPerBin: number,
): number {
  const start = Math.max(0, Math.floor(lowHz / hzPerBin))
  const end = Math.min(freq.length - 1, Math.ceil(highHz / hzPerBin))
  if (end < start) return 0
  let sum = 0
  for (let i = start; i <= end; i++) sum += freq[i]
  return sum / (end - start + 1) / 255
}

/**
 * Reduce a raw FFT magnitude array into bass / mid / treble averages (each 0..1).
 * Pure: bin→Hz mapping is derived from sampleRate and fftSize.
 */
export function reduceBands(
  freq: Uint8Array,
  sampleRate: number,
  fftSize: number,
): Bands {
  const hzPerBin = sampleRate / fftSize
  return {
    bass: averageRange(freq, BAND_RANGES.bass[0], BAND_RANGES.bass[1], hzPerBin),
    mid: averageRange(freq, BAND_RANGES.mid[0], BAND_RANGES.mid[1], hzPerBin),
    treble: averageRange(freq, BAND_RANGES.treble[0], BAND_RANGES.treble[1], hzPerBin),
  }
}

/**
 * Overall loudness as RMS of the time-domain waveform, normalized to 0..1.
 * Time-domain bytes are centered at 128; deviation from center is the signal.
 */
export function computeLevel(time: Uint8Array): number {
  if (time.length === 0) return 0
  let sumSquares = 0
  for (let i = 0; i < time.length; i++) {
    const v = (time[i] - 128) / 128
    sumSquares += v * v
  }
  return Math.sqrt(sumSquares / time.length)
}
