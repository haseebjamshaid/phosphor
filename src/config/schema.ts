import { z } from 'zod'

/** A #rrggbb hex color string. */
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Expected a #rrggbb hex color')

/** What a frequency band drives on a reactive element. */
export const reactTargetSchema = z.enum(['scale', 'color', 'displacement', 'rotation', 'none'])

/**
 * The single source of truth for the visuals. The leva panel edits it, presets
 * are instances of it, and every renderer reads exclusively from it.
 */
export const visualizerConfigSchema = z.object({
  palette: z.object({
    background: hexColor,
    primary: hexColor,
    secondary: hexColor,
    accent: hexColor,
  }),
  elements: z.object({
    oilSlick: z.boolean(),
    bokeh: z.boolean(),
  }),
  effects: z.object({
    grain: z.object({
      enabled: z.boolean(),
      opacity: z.number().min(0).max(1),
    }),
    chromaticAberration: z.object({
      enabled: z.boolean(),
      offset: z.number().min(0).max(0.02),
      beatKick: z.number().min(0).max(1),
    }),
    bloom: z.object({
      enabled: z.boolean(),
      intensity: z.number().min(0).max(3),
      threshold: z.number().min(0).max(1),
    }),
    glitch: z.object({
      enabled: z.boolean(),
      intensity: z.number().min(0).max(1),
    }),
    kaleidoscope: z.object({
      enabled: z.boolean(),
      segments: z.number().int().min(0).max(24),
      twist: z.number().min(0).max(2),
    }),
  }),
  reactivity: z.object({
    bassTarget: reactTargetSchema,
    midTarget: reactTargetSchema,
    trebleTarget: reactTargetSchema,
    sensitivity: z.number().min(0).max(2),
    smoothing: z.number().min(0).max(1),
    beatSensitivity: z.number().min(0).max(1),
  }),
})

export type ReactTarget = z.infer<typeof reactTargetSchema>
export type VisualizerConfig = z.infer<typeof visualizerConfigSchema>
