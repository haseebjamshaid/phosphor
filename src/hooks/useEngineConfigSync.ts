import { useEffect } from 'react'
import { useConfigStore } from '../store/configStore'
import { useRuntimeStore } from '../store/runtimeStore'

/**
 * Pushes audio-related config (analyser smoothing, beat sensitivity) into the live
 * engine whenever either changes. Human-paced — fine to run as a React effect.
 */
export function useEngineConfigSync(): void {
  const engine = useRuntimeStore((s) => s.engine)
  const smoothing = useConfigStore((s) => s.config.reactivity.smoothing)
  const beatSensitivity = useConfigStore((s) => s.config.reactivity.beatSensitivity)

  useEffect(() => {
    if (!engine) return
    engine.setSmoothing(smoothing)
    engine.setBeatSensitivity(beatSensitivity)
  }, [engine, smoothing, beatSensitivity])
}
