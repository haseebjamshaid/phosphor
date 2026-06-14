import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from '../config/defaults'
import { PRESETS } from '../config/presets'
import { useConfigStore } from './configStore'

beforeEach(() => {
  useConfigStore.getState().reset()
})

describe('configStore', () => {
  it('starts from the default config', () => {
    expect(useConfigStore.getState().config).toEqual(DEFAULT_CONFIG)
  })

  it('applyPreset deep-clones the preset so store edits never mutate the source', () => {
    useConfigStore.getState().applyPreset('datamosh')
    const { config } = useConfigStore.getState()
    expect(config).toEqual(PRESETS.datamosh.config)
    expect(config).not.toBe(PRESETS.datamosh.config)

    useConfigStore.getState().patch(['effects', 'glitch', 'intensity'], 0.1)
    expect(PRESETS.datamosh.config.effects.glitch.intensity).not.toBe(0.1)
  })

  it('patch immutably updates a nested field with structural sharing', () => {
    const before = useConfigStore.getState().config
    useConfigStore.getState().patch(['reactivity', 'sensitivity'], 1.5)
    const after = useConfigStore.getState().config

    expect(after).not.toBe(before)
    expect(after.reactivity).not.toBe(before.reactivity)
    expect(after.reactivity.sensitivity).toBe(1.5)
    expect(before.reactivity.sensitivity).toBe(DEFAULT_CONFIG.reactivity.sensitivity)
    expect(after.palette).toBe(before.palette) // untouched branch keeps its reference
  })

  it('bumps presetVersion on applyPreset but not on patch', () => {
    const v0 = useConfigStore.getState().presetVersion
    useConfigStore.getState().applyPreset('oilSpill')
    const v1 = useConfigStore.getState().presetVersion
    expect(v1).toBe(v0 + 1)

    useConfigStore.getState().patch(['reactivity', 'sensitivity'], 1.2)
    expect(useConfigStore.getState().presetVersion).toBe(v1)
  })

  it('setConfig replaces the config and clears the active preset', () => {
    const next = structuredClone(DEFAULT_CONFIG)
    next.palette.primary = '#ffffff'
    useConfigStore.getState().setConfig(next)
    expect(useConfigStore.getState().config.palette.primary).toBe('#ffffff')
    expect(useConfigStore.getState().activePreset).toBeNull()
  })
})
