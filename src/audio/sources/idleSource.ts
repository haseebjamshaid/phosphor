import type { AudioFrame } from '../audioFrame'
import { BEAT_DECAY } from '../../lib/constants'
import type { AudioSource } from './AudioSource'

const SYNTH_BEAT_INTERVAL = 0.5 // seconds between synthetic beats (~120 bpm)

/**
 * Synthetic "self-animation" source for the cold open and unsupported browsers.
 * Produces gently oscillating bands and a steady synthetic beat so the visuals
 * always look alive with no real audio. Fills the AudioFrame via `sample`.
 */
export function createIdleSource(): AudioSource {
  let elapsed = 0
  let nextBeat = SYNTH_BEAT_INTERVAL

  return {
    kind: 'idle',
    async connect(): Promise<AudioNode | null> {
      return null
    },
    dispose(): void {},
    sample(frame: AudioFrame, delta: number): void {
      elapsed += delta
      frame.t = elapsed

      frame.bass = 0.3 + 0.25 * Math.sin(elapsed * 1.2)
      frame.mid = 0.25 + 0.2 * Math.sin(elapsed * 0.8 + 1)
      frame.treble = 0.2 + 0.15 * Math.sin(elapsed * 1.7 + 2)
      frame.level = (frame.bass + frame.mid + frame.treble) / 3

      frame.beat = false
      if (elapsed >= nextBeat) {
        frame.beat = true
        frame.beatEnergy = 0.8
        frame.sinceBeat = 0
        nextBeat = elapsed + SYNTH_BEAT_INTERVAL
      } else {
        frame.sinceBeat += delta
      }
      frame.beatEnergy = Math.max(0, frame.beatEnergy - delta * BEAT_DECAY)
    },
  }
}
