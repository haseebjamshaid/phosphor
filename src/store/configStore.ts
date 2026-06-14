import { create } from 'zustand'
import { DEFAULT_CONFIG } from '../config/defaults'
import { PRESETS, type PresetKey } from '../config/presets'
import type { VisualizerConfig } from '../config/schema'
import { setPath } from '../lib/immutable'

interface ConfigState {
  /** The reactive config. Visual elements subscribe to this — it changes at human pace. */
  config: VisualizerConfig
  /** Last preset applied (for highlighting); null after manual edits. */
  activePreset: PresetKey | null
  /** Bumped only when a preset/reset is applied, so the leva panel can reseed. */
  presetVersion: number
  setConfig: (config: VisualizerConfig) => void
  /** Immutably set one nested field by path (e.g. ['palette', 'background']). */
  patch: (path: readonly string[], value: unknown) => void
  applyPreset: (key: PresetKey) => void
  reset: () => void
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: DEFAULT_CONFIG,
  activePreset: 'default',
  presetVersion: 0,
  setConfig: (config) => set({ config, activePreset: null }),
  patch: (path, value) => set((state) => ({ config: setPath(state.config, path, value) })),
  applyPreset: (key) =>
    set((state) => ({
      config: structuredClone(PRESETS[key].config),
      activePreset: key,
      presetVersion: state.presetVersion + 1,
    })),
  reset: () =>
    set((state) => ({
      config: structuredClone(DEFAULT_CONFIG),
      activePreset: 'default',
      presetVersion: state.presetVersion + 1,
    })),
}))
