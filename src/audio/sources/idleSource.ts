import type { AudioFrame } from '../audioFrame'
import { BEAT_DECAY } from '../../lib/constants'
import type { AudioSource } from './AudioSource'

/**
 * Synthetic "self-animation" source for the cold open and unsupported browsers.
 * A slow, low-amplitude breathing — alive but calm, with NO synthetic beats, so the
 * entry/picker screen drifts gently instead of pulsing. Fills the AudioFrame via `sample`.
 */
export function createIdleSource(): AudioSource {
  let elapsed = 0

  return {
    kind: 'idle',
    async connect(): Promise<AudioNode | null> {
      return null
    },
    dispose(): void {},
    sample(frame: AudioFrame, delta: number): void {
      elapsed += delta
      frame.t = elapsed

      // Gentle, slow drift — small amplitudes so the form merely breathes.
      frame.bass = 0.12 + 0.07 * Math.sin(elapsed * 0.5)
      frame.mid = 0.1 + 0.05 * Math.sin(elapsed * 0.35 + 1)
      frame.treble = 0.07 + 0.04 * Math.sin(elapsed * 0.7 + 2)
      frame.level = (frame.bass + frame.mid + frame.treble) / 3

      // No synthetic beats — let any residual beat energy decay to stillness.
      frame.beat = false
      frame.sinceBeat += delta
      frame.beatEnergy = Math.max(0, frame.beatEnergy - delta * BEAT_DECAY)
    },
  }
}
