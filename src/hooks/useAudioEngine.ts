import { useCallback } from 'react'
import { AudioEngine } from '../audio/AudioEngine'
import type { AudioSource } from '../audio/sources/AudioSource'
import { createFileAudioSource } from '../audio/sources/fileAudioSource'
import { createIdleSource } from '../audio/sources/idleSource'
import { createSystemAudioSource } from '../audio/sources/systemAudioSource'
import { getErrorMessage } from '../lib/errors'
import { useRuntimeStore } from '../store/runtimeStore'

interface UseAudioEngine {
  startFile: (file: File) => Promise<void>
  startSystem: () => Promise<void>
  startIdle: () => Promise<void>
}

/** Lazily creates the singleton AudioEngine and wires the chosen source into it. */
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

  const startSource = useCallback(
    async (makeSource: () => AudioSource): Promise<void> => {
      try {
        setStatus('connecting')
        const engine = getOrCreateEngine()
        await engine.resume()
        await engine.setSource(makeSource())
        setStatus('live')
      } catch (error: unknown) {
        setError(getErrorMessage(error))
      }
    },
    [getOrCreateEngine, setStatus, setError],
  )

  const startIdle = useCallback(() => startSource(createIdleSource), [startSource])

  const startFile = useCallback(
    (file: File) => startSource(() => createFileAudioSource(file)),
    [startSource],
  )

  const startSystem = useCallback(
    () =>
      startSource(() =>
        createSystemAudioSource(() => {
          void startIdle()
        }),
      ),
    [startSource, startIdle],
  )

  return { startFile, startSystem, startIdle }
}
