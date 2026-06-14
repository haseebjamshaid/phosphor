import {
  ANALYSER_SMOOTHING,
  BAND_HALF_LIFE,
  BEAT_DECAY,
  FFT_SIZE,
} from '../lib/constants'
import { clamp01, expSmooth } from '../lib/math'
import { computeLevel, reduceBands } from './bands'
import { BeatDetector } from './beatDetector'
import { createAudioFrame, type AudioFrame } from './audioFrame'
import type { AudioSource } from './sources/AudioSource'

/**
 * Owns the single AudioContext + AnalyserNode for the app lifetime and the one
 * mutable AudioFrame. `tick(delta)` is the per-frame pump called from FrameDriver;
 * it reads the analyser and updates the frame in place — no allocation, no React.
 */
export class AudioEngine {
  readonly context: AudioContext
  readonly analyser: AnalyserNode
  readonly frame: AudioFrame

  private readonly beatDetector = new BeatDetector()
  private source: AudioSource | null = null

  constructor() {
    this.context = new AudioContext()
    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = FFT_SIZE
    this.analyser.smoothingTimeConstant = ANALYSER_SMOOTHING
    this.frame = createAudioFrame(this.analyser.frequencyBinCount, this.analyser.fftSize)
  }

  /** Apply the analyser's temporal smoothing (0..1) from config. */
  setSmoothing(smoothing: number): void {
    this.analyser.smoothingTimeConstant = clamp01(smoothing)
  }

  /** Apply beat-detection sensitivity (0..1) from config. */
  setBeatSensitivity(sensitivity: number): void {
    this.beatDetector.setSensitivity(sensitivity)
  }

  /** Resume the context (must be called from a user gesture). */
  async resume(): Promise<void> {
    if (this.context.state !== 'running') {
      await this.context.resume()
    }
  }

  /**
   * Swap the active source. Connects the new source FIRST, so if connect throws
   * (e.g. the user declines the share prompt) the previously active source keeps
   * running instead of leaving the engine in a dead state.
   */
  async setSource(source: AudioSource): Promise<void> {
    const node = await source.connect(this.context)
    this.source?.dispose()
    this.beatDetector.reset()
    this.source = source
    if (node) node.connect(this.analyser)
  }

  /** Per-frame pump: analyser → bands/beat → AudioFrame (mutated in place). */
  tick(delta: number): void {
    const source = this.source
    if (source?.sample) {
      // Synthetic source (idle): fills the frame directly, no analyser.
      source.sample(this.frame, delta)
      return
    }

    const { analyser, frame, context } = this
    analyser.getByteFrequencyData(frame.freq)
    analyser.getByteTimeDomainData(frame.time)

    const bands = reduceBands(frame.freq, context.sampleRate, analyser.fftSize)
    frame.bass = expSmooth(frame.bass, bands.bass, BAND_HALF_LIFE, delta)
    frame.mid = expSmooth(frame.mid, bands.mid, BAND_HALF_LIFE, delta)
    frame.treble = expSmooth(frame.treble, bands.treble, BAND_HALF_LIFE, delta)
    frame.level = expSmooth(frame.level, computeLevel(frame.time), BAND_HALF_LIFE, delta)

    const { beat, energy } = this.beatDetector.update(bands.bass, delta)
    frame.sinceBeat += delta
    frame.beat = beat
    if (beat) {
      frame.sinceBeat = 0
      frame.beatEnergy = Math.max(frame.beatEnergy, energy)
    }
    frame.beatEnergy = Math.max(0, frame.beatEnergy - delta * BEAT_DECAY)

    frame.t += delta
  }

  dispose(): void {
    this.source?.dispose()
    this.source = null
    void this.context.close()
  }
}
