import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from './defaults'
import { visualizerConfigSchema } from './schema'

describe('visualizerConfigSchema', () => {
  it('accepts the default config', () => {
    expect(visualizerConfigSchema.safeParse(DEFAULT_CONFIG).success).toBe(true)
  })

  it('rejects a malformed hex color', () => {
    const bad = structuredClone(DEFAULT_CONFIG)
    bad.palette.background = 'blue'
    expect(visualizerConfigSchema.safeParse(bad).success).toBe(false)
  })

  it('rejects an out-of-range number', () => {
    const bad = structuredClone(DEFAULT_CONFIG)
    bad.reactivity.sensitivity = 5 // max is 2
    expect(visualizerConfigSchema.safeParse(bad).success).toBe(false)
  })

  it('rejects an invalid react target', () => {
    const bad = structuredClone(DEFAULT_CONFIG)
    ;(bad.reactivity as { bassTarget: string }).bassTarget = 'wobble'
    expect(visualizerConfigSchema.safeParse(bad).success).toBe(false)
  })

  it('rejects a non-integer segment count', () => {
    const bad = structuredClone(DEFAULT_CONFIG)
    bad.effects.kaleidoscope.segments = 3.5
    expect(visualizerConfigSchema.safeParse(bad).success).toBe(false)
  })
})
