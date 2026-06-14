import { useCallback } from 'react'
import { AudioEngine } from '../audio/AudioEngine'
import { createFileAudioSource } from '../audio/sources/fileAudioSource'
import { getErrorMessage } from '../lib/errors'
import { useRuntimeStore } from '../store/runtimeStore'

interface UseAudioEngine {
  startFile: (file: File) => Promise<void>
}

/** Lazily creates the singleton AudioEngine and wires sources into it. */
export function useAudioEngine(): UseAudioEngine {
  const setEngine = useRuntimeStore((s) => s.setEngine)
  const setStatus = useRuntimeStore((s) => s.setStatus)
  const setError = useRuntimeStore((s) => s.setError)

  const getOrCreateEngine = useCallback((): AudioEngine => {
    const existing = useRuntimeStore.getState().engine
    if (existing) return existing
    const engine = new AudioEngine()
    setEngine(engine)
    return engine
  }, [setEngine])

  const startFile = useCallback(
    async (file: File): Promise<void> => {
      try {
        setStatus('connecting')
        const engine = getOrCreateEngine()
        await engine.resume()
        await engine.setSource(createFileAudioSource(file))
        setStatus('live')
      } catch (error: unknown) {
        setError(getErrorMessage(error))
      }
    },
    [getOrCreateEngine, setStatus, setError],
  )

  return { startFile }
}
