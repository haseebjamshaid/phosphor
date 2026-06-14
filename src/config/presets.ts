import { DEFAULT_CONFIG } from './defaults'
import type { VisualizerConfig } from './schema'

export interface Preset {
  name: string
  config: VisualizerConfig
}

/** Dark blue bokeh, gentle drift — the "Blue Séance" reference. */
const blueSeance: VisualizerConfig = {
  palette: {
    background: '#04060d',
    primary: '#3f6fff',
    secondary: '#2541a8',
    accent: '#9fc2ff',
  },
  elements: { oilSlick: true, bokeh: true },
  effects: {
    grain: { enabled: true, opacity: 0.14 },
    chromaticAberration: { enabled: true, offset: 0.001, beatKick: 0.2 },
    bloom: { enabled: true, intensity: 1.0, threshold: 0.2 },
    glitch: { enabled: false, intensity: 0.15 },
    kaleidoscope: { enabled: false, segments: 6, twist: 0.2 },
  },
  reactivity: {
    bassTarget: 'scale',
    midTarget: 'color',
    trebleTarget: 'none',
    sensitivity: 0.7,
    smoothing: 0.9,
    beatSensitivity: 0.3,
  },
}

/** Pixel-sort dissolve, hard glitch on beats — the "Datamosh" reference. */
const datamosh: VisualizerConfig = {
  palette: {
    background: '#070510',
    primary: '#ff3cac',
    secondary: '#2bd2ff',
    accent: '#f5f7ff',
  },
  elements: { oilSlick: true, bokeh: false },
  effects: {
    grain: { enabled: true, opacity: 0.16 },
    chromaticAberration: { enabled: true, offset: 0.004, beatKick: 0.9 },
    bloom: { enabled: true, intensity: 1.1, threshold: 0.18 },
    glitch: { enabled: true, intensity: 0.9 },
    kaleidoscope: { enabled: false, segments: 4, twist: 0.4 },
  },
  reactivity: {
    bassTarget: 'displacement',
    midTarget: 'color',
    trebleTarget: 'rotation',
    sensitivity: 1.4,
    smoothing: 0.65,
    beatSensitivity: 0.85,
  },
}

/** Iridescent rainbow refraction, kaleidoscope on — the "Oil Spill" reference. */
const oilSpill: VisualizerConfig = {
  palette: {
    background: '#05060a',
    primary: '#19f0c8',
    secondary: '#ff5da2',
    accent: '#ffd166',
  },
  elements: { oilSlick: true, bokeh: false },
  effects: {
    grain: { enabled: true, opacity: 0.1 },
    chromaticAberration: { enabled: true, offset: 0.006, beatKick: 0.6 },
    bloom: { enabled: true, intensity: 1.6, threshold: 0.1 },
    glitch: { enabled: true, intensity: 0.35 },
    kaleidoscope: { enabled: true, segments: 8, twist: 0.7 },
  },
  reactivity: {
    bassTarget: 'scale',
    midTarget: 'displacement',
    trebleTarget: 'color',
    sensitivity: 1.1,
    smoothing: 0.78,
    beatSensitivity: 0.6,
  },
}

export const PRESETS = {
  default: { name: 'Default', config: DEFAULT_CONFIG },
  blueSeance: { name: 'Blue Séance', config: blueSeance },
  datamosh: { name: 'Datamosh', config: datamosh },
  oilSpill: { name: 'Oil Spill', config: oilSpill },
} as const satisfies Record<string, Preset>

export type PresetKey = keyof typeof PRESETS

/** Display-name → preset-key map, for the leva/preset selector. */
export const PRESET_OPTIONS: Record<string, PresetKey> = Object.fromEntries(
  (Object.keys(PRESETS) as PresetKey[]).map((key) => [PRESETS[key].name, key]),
)
