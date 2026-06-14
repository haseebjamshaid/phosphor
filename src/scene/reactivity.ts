import type { AudioFrame } from '../audio/audioFrame'
import type { ReactTarget, VisualizerConfig } from '../config/schema'

export interface TargetAmounts {
  scale: number
  color: number
  displacement: number
  rotation: number
}

/**
 * Route the three bands to their configured targets, scaled by sensitivity.
 * Bands whose target is 'none' contribute nothing; multiple bands sharing a target
 * accumulate. Pure — unit-tested.
 */
export function computeTargets(
  frame: Pick<AudioFrame, 'bass' | 'mid' | 'treble'>,
  reactivity: VisualizerConfig['reactivity'],
): TargetAmounts {
  const amounts: TargetAmounts = { scale: 0, color: 0, displacement: 0, rotation: 0 }
  const add = (target: ReactTarget, value: number) => {
    if (target !== 'none') amounts[target] += value
  }
  add(reactivity.bassTarget, frame.bass)
  add(reactivity.midTarget, frame.mid)
  add(reactivity.trebleTarget, frame.treble)

  const s = reactivity.sensitivity
  return {
    scale: amounts.scale * s,
    color: amounts.color * s,
    displacement: amounts.displacement * s,
    rotation: amounts.rotation * s,
  }
}
