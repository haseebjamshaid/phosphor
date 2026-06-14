import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Glitch, Noise } from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'
import type { BloomEffect, ChromaticAberrationEffect, GlitchEffect } from 'postprocessing'
import { useCallback, useRef, type ReactElement } from 'react'
import { useConfigStore } from '../../store/configStore'
import { useAudioFrame } from '../useAudioFrame'
import { Kaleidoscope } from './kaleidoscopeEffect'

const BEAT_CA_SCALE = 0.006 // how much a full beat adds to the CA offset
const LEVEL_BLOOM_SCALE = 0.4 // how much loudness brightens the bloom
const GLITCH_THRESHOLD = 0.15 // beatEnergy*intensity above this triggers a glitch burst

/**
 * The always-on baseline post chain: bloom glow, chromatic aberration, film grain.
 * Effect uniforms are pumped per-frame from the AudioFrame via refs (CA kicks on
 * beats, bloom breathes with level) — never through React props, so no re-renders.
 * Keyed on the enabled-combination so toggling an effect cleanly re-mounts the composer.
 */
export function PostStack() {
  const effects = useConfigStore((s) => s.config.effects)
  const frame = useAudioFrame()
  // Callback refs (functions), not ref objects: @react-three/postprocessing's
  // wrapEffect JSON.stringifies its props as a memo key, and in React 19 `ref` is a
  // prop. A ref OBJECT would serialize ref.current (a Three effect full of textures
  // with circular parent/children) and crash. A function ref is dropped by
  // JSON.stringify, so it's safe while still handing us the instance.
  const caRef = useRef<ChromaticAberrationEffect | null>(null)
  const bloomRef = useRef<BloomEffect | null>(null)
  const glitchRef = useRef<GlitchEffect | null>(null)
  const setCa = useCallback((effect: ChromaticAberrationEffect | null) => {
    caRef.current = effect
  }, [])
  const setBloom = useCallback((effect: BloomEffect | null) => {
    bloomRef.current = effect
  }, [])
  const setGlitch = useCallback((effect: GlitchEffect | null) => {
    glitchRef.current = effect
  }, [])

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

    const glitch = glitchRef.current
    if (glitch) {
      // Burst while the beat energy is still hot, then fall silent.
      glitch.mode =
        beat * effects.glitch.intensity > GLITCH_THRESHOLD ? GlitchMode.CONSTANT_WILD : GlitchMode.DISABLED
    }
  })

  const passes: ReactElement[] = []
  if (effects.kaleidoscope.enabled) {
    passes.push(<Kaleidoscope key="kaleido" />)
  }
  if (effects.bloom.enabled) {
    passes.push(
      <Bloom
        key="bloom"
        ref={setBloom}
        mipmapBlur
        intensity={effects.bloom.intensity}
        luminanceThreshold={effects.bloom.threshold}
        luminanceSmoothing={0.2}
      />,
    )
  }
  if (effects.chromaticAberration.enabled) {
    passes.push(<ChromaticAberration key="ca" ref={setCa} />)
  }
  if (effects.glitch.enabled) {
    passes.push(<Glitch key="glitch" ref={setGlitch} mode={GlitchMode.DISABLED} active />)
  }
  if (effects.grain.enabled) {
    passes.push(<Noise key="grain" opacity={effects.grain.opacity} />)
  }

  if (passes.length === 0) return null

  // Re-mount the composer when the set of enabled effects changes.
  const composerKey = passes.map((p) => p.key).join('-')

  return <EffectComposer key={composerKey}>{passes}</EffectComposer>
}
