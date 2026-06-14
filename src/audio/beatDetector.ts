import { BEAT_DEFAULTS } from '../lib/constants'
import { clamp01, mean } from '../lib/math'

export interface BeatResult {
  /** True only on the frame a beat fires. */
  beat: boolean
  /** Relative strength of the beat (0..1); 0 when no beat. */
  energy: number
}

export interface BeatDetectorOptions {
  historySize: number
  minHistory: number
  thresholdMultiplier: number
  minIntervalMs: number
  minEnergy: number
}

/**
 * Energy-based beat detector. Compares the instantaneous band energy against a
 * rolling average and fires when it spikes above `avg * thresholdMultiplier`,
 * respecting a refractory interval so a single transient fires once.
 *
 * Pure and deterministic given its inputs — unit-tested with synthetic energy.
 */
export class BeatDetector {
  private readonly options: BeatDetectorOptions
  private history: number[] = []
  private timeSinceBeatMs = Number.POSITIVE_INFINITY

  constructor(options: Partial<BeatDetectorOptions> = {}) {
    this.options = { ...BEAT_DEFAULTS, ...options }
  }

  reset(): void {
    this.history = []
    this.timeSinceBeatMs = Number.POSITIVE_INFINITY
  }

  /** Feed one frame's energy (0..1) and the elapsed time since the last call (seconds). */
  update(instant: number, deltaSeconds: number): BeatResult {
    this.timeSinceBeatMs += deltaSeconds * 1000

    const avg = mean(this.history)

    this.history.push(instant)
    if (this.history.length > this.options.historySize) this.history.shift()

    const refractoryPassed = this.timeSinceBeatMs >= this.options.minIntervalMs
    const isBeat =
      this.history.length >= this.options.minHistory &&
      instant >= this.options.minEnergy &&
      instant > avg * this.options.thresholdMultiplier &&
      refractoryPassed

    if (!isBeat) return { beat: false, energy: 0 }

    this.timeSinceBeatMs = 0
    const energy = clamp01((instant - avg) / Math.max(avg, 1e-4))
    return { beat: true, energy }
  }
}
