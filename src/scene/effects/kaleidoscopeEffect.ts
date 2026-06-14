import { wrapEffect } from '@react-three/postprocessing'
import { Effect } from 'postprocessing'
import { Uniform } from 'three'
import { useConfigStore } from '../../store/configStore'
import { useRuntimeStore } from '../../store/runtimeStore'
import { kaleidoscopeFragment } from './kaleidoscope.frag'

/**
 * Custom kaleidoscope post effect. `update()` runs every composer frame and pulls
 * segment count / twist from config + the live AudioFrame (treble adds segments,
 * beats add twist) — non-reactively, so no React re-renders.
 */
class KaleidoscopeEffectImpl extends Effect {
  constructor() {
    super('KaleidoscopeEffect', kaleidoscopeFragment, {
      uniforms: new Map([
        ['uSegments', new Uniform(6)],
        ['uTwist', new Uniform(0.3)],
      ]),
    })
  }

  override update(): void {
    const config = useConfigStore.getState().config.effects.kaleidoscope
    const frame = useRuntimeStore.getState().engine?.frame
    const treble = frame?.treble ?? 0
    const beat = frame?.beatEnergy ?? 0

    const segments = this.uniforms.get('uSegments')
    const twist = this.uniforms.get('uTwist')
    if (segments) segments.value = config.segments + Math.round(treble * 4)
    if (twist) twist.value = config.twist + beat * 0.5
  }
}

export const Kaleidoscope = wrapEffect(KaleidoscopeEffectImpl)
