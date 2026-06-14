import { describe, expect, it } from 'vitest'
import { PRESETS, type PresetKey } from './presets'
import { visualizerConfigSchema } from './schema'

describe('presets', () => {
  it('every preset validates against the schema', () => {
    for (const key of Object.keys(PRESETS) as PresetKey[]) {
      expect(visualizerConfigSchema.safeParse(PRESETS[key].config).success).toBe(true)
    }
  })

  it('datamosh leans into glitch', () => {
    expect(PRESETS.datamosh.config.effects.glitch.enabled).toBe(true)
    expect(PRESETS.datamosh.config.effects.chromaticAberration.beatKick).toBeGreaterThan(0.5)
  })

  it('oilSpill turns on the kaleidoscope', () => {
    expect(PRESETS.oilSpill.config.effects.kaleidoscope.enabled).toBe(true)
  })

  it('blueSeance emphasizes bokeh and stays calm', () => {
    expect(PRESETS.blueSeance.config.elements.bokeh).toBe(true)
    expect(PRESETS.blueSeance.config.effects.kaleidoscope.enabled).toBe(false)
  })
})
