/**
 * The hot-path carrier for live audio data.
 *
 * IMPORTANT: this object is allocated ONCE and MUTATED IN PLACE every frame. That
 * is a deliberate, scoped exception to the project's immutability rule — it is the
 * non-React performance path (AnalyserNode → here → useFrame → shader uniforms) and
 * is never used as React state. Do NOT "fix" this into immutable updates; doing so
 * would allocate ~60 objects/second and defeat the entire perf design.
 */
export interface AudioFrame {
  /** Raw FFT magnitudes (getByteFrequencyData target), length = fftSize / 2. */
  freq: Uint8Array<ArrayBuffer>
  /** Raw waveform samples (getByteTimeDomainData target), length = fftSize. */
  time: Uint8Array<ArrayBuffer>
  /** Smoothed low/mid/high energy, each 0..1. */
  bass: number
  mid: number
  treble: number
  /** Overall loudness (RMS), 0..1. */
  level: number
  /** True only on the frame a beat fires. */
  beat: boolean
  /** Decaying beat strength, 0..1 — use this to drive visual bursts. */
  beatEnergy: number
  /** Seconds since the last beat. */
  sinceBeat: number
  /** Elapsed time in seconds (drives idle/ambient drift). */
  t: number
}

/** Allocate the single AudioFrame with pre-sized typed arrays. */
export function createAudioFrame(binCount: number, sampleCount: number): AudioFrame {
  return {
    freq: new Uint8Array(new ArrayBuffer(binCount)),
    time: new Uint8Array(new ArrayBuffer(sampleCount)),
    bass: 0,
    mid: 0,
    treble: 0,
    level: 0,
    beat: false,
    beatEnergy: 0,
    sinceBeat: Number.POSITIVE_INFINITY,
    t: 0,
  }
}
