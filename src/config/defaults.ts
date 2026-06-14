import type { VisualizerConfig } from './schema'

/** Sensible balanced starting point — the "Default" preset. */
export const DEFAULT_CONFIG: VisualizerConfig = {
  palette: {
    background: '#05060a',
    primary: '#6ea8ff',
    secondary: '#b06cff',
    accent: '#7cffcb',
  },
  elements: {
    oilSlick: true,
    bokeh: true,
  },
  effects: {
    grain: { enabled: true, opacity: 0.08 },
    chromaticAberration: { enabled: true, offset: 0.0015, beatKick: 0.4 },
    bloom: { enabled: true, intensity: 1.2, threshold: 0.15 },
    glitch: { enabled: true, intensity: 0.5 },
    kaleidoscope: { enabled: false, segments: 6, twist: 0.3 },
  },
  reactivity: {
    bassTarget: 'scale',
    midTarget: 'color',
    trebleTarget: 'displacement',
    sensitivity: 1,
    smoothing: 0.8,
    beatSensitivity: 0.65,
  },
}
