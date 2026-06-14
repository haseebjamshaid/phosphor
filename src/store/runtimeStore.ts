import { create } from 'zustand'
import type { AudioEngine } from '../audio/AudioEngine'

export type EngineStatus = 'idle' | 'connecting' | 'live' | 'error'

interface RuntimeState {
  /**
   * The live engine. Read it NON-reactively via `useRuntimeStore.getState().engine`
   * inside useFrame / rAF loops. The selector hook re-renders only when the engine
   * instance itself is swapped (rare) — never per audio frame.
   */
  engine: AudioEngine | null
  status: EngineStatus
  error: string | null
  setEngine: (engine: AudioEngine) => void
  setStatus: (status: EngineStatus) => void
  setError: (error: string | null) => void
}

export const useRuntimeStore = create<RuntimeState>((set) => ({
  engine: null,
  status: 'idle',
  error: null,
  setEngine: (engine) => set({ engine }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
}))
