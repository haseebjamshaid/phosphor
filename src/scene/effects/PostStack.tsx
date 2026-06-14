import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing'
import type { BloomEffect, ChromaticAberrationEffect } from 'postprocessing'
import { useRef, type ReactElement } from 'react'
import { useConfigStore } from '../../store/configStore'
import { useAudioFrame } from '../useAudioFrame'

const BEAT_CA_SCALE = 0.006 // how much a full beat adds to the CA offset
const LEVEL_BLOOM_SCALE = 0.4 // how much loudness brightens the bloom

/**
 * The always-on baseline post chain: bloom glow, chromatic aberration, film grain.
 * Effect uniforms are pumped per-frame from the AudioFrame via refs (CA kicks on
 * beats, bloom breathes with level) — never through React props, so no re-renders.
 * Keyed on the enabled-combination so toggling an effect cleanly re-mounts the composer.
 */
export function PostStack() {
  const effects = useConfigStore((s) => s.config.effects)
  const frame = useAudioFrame()
  const caRef = useRef<ChromaticAberrationEffect>(null)
  const bloomRef = useRef<BloomEffect>(null)

  useFrame(() => {
    const beat = frame?.beatEnergy ?? 0
    const level = frame?.level ?? 0

    const ca = caRef.current
    if (ca) {
      const off =
        effects.chromaticAberration.offset + beat * effects.chromaticAberration.beatKick * BEAT_CA_SCALE
      ca.offset.set(off, off)
    }

    const bloom = bloomRef.current
    if (bloom) {
      bloom.intensity = effects.bloom.intensity * (1 + level * LEVEL_BLOOM_SCALE)
    }
  })

  const passes: ReactElement[] = []
  if (effects.bloom.enabled) {
    passes.push(
      <Bloom
        key="bloom"
        ref={bloomRef}
        mipmapBlur
        intensity={effects.bloom.intensity}
        luminanceThreshold={effects.bloom.threshold}
        luminanceSmoothing={0.2}
      />,
    )
  }
  if (effects.chromaticAberration.enabled) {
    passes.push(<ChromaticAberration key="ca" ref={caRef} />)
  }
  if (effects.grain.enabled) {
    passes.push(<Noise key="grain" opacity={effects.grain.opacity} />)
  }

  if (passes.length === 0) return null

  // Re-mount the composer when the set of enabled effects changes.
  const composerKey = passes.map((p) => p.key).join('-')

  return <EffectComposer key={composerKey}>{passes}</EffectComposer>
}
