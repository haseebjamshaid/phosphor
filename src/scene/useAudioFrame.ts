import type { AudioFrame } from '../audio/audioFrame'
import { useRuntimeStore } from '../store/runtimeStore'

/**
 * Returns the stable, mutable AudioFrame reference for reading inside useFrame.
 * Re-renders only when the engine instance is swapped — never per audio frame.
 * Read fields from the returned frame inside useFrame; do not put them in state.
 */
export function useAudioFrame(): AudioFrame | null {
  const engine = useRuntimeStore((s) => s.engine)
  return engine?.frame ?? null
}
