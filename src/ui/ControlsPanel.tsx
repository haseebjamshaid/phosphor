import { Leva, folder, useControls } from 'leva'
import { PRESET_OPTIONS, type PresetKey } from '../config/presets'
import type { ReactTarget } from '../config/schema'
import { useConfigStore } from '../store/configStore'

const TARGET_OPTIONS: ReactTarget[] = ['scale', 'color', 'displacement', 'rotation', 'none']

/**
 * The per-parameter controls. Remounted (via a `key` on presetVersion) whenever a
 * preset is applied, so leva reseeds its displayed values from the new config. Each
 * control patches its single field into the store on change.
 */
function ParameterControls() {
  const patch = useConfigStore((s) => s.patch)
  const config = useConfigStore.getState().config

  useControls({
    Palette: folder(
      {
        background: { value: config.palette.background, onChange: (v) => patch(['palette', 'background'], v) },
        primary: { value: config.palette.primary, onChange: (v) => patch(['palette', 'primary'], v) },
        secondary: { value: config.palette.secondary, onChange: (v) => patch(['palette', 'secondary'], v) },
        accent: { value: config.palette.accent, onChange: (v) => patch(['palette', 'accent'], v) },
      },
      { collapsed: true },
    ),
    Elements: folder(
      {
        oilSlick: { value: config.elements.oilSlick, onChange: (v) => patch(['elements', 'oilSlick'], v) },
        bokeh: { value: config.elements.bokeh, onChange: (v) => patch(['elements', 'bokeh'], v) },
      },
      { collapsed: true },
    ),
    Reactivity: folder(
      {
        sensitivity: { value: config.reactivity.sensitivity, min: 0, max: 2, step: 0.01, onChange: (v) => patch(['reactivity', 'sensitivity'], v) },
        smoothing: { value: config.reactivity.smoothing, min: 0, max: 1, step: 0.01, onChange: (v) => patch(['reactivity', 'smoothing'], v) },
        beatSensitivity: { value: config.reactivity.beatSensitivity, min: 0, max: 1, step: 0.01, onChange: (v) => patch(['reactivity', 'beatSensitivity'], v) },
        bassTarget: { value: config.reactivity.bassTarget, options: TARGET_OPTIONS, onChange: (v) => patch(['reactivity', 'bassTarget'], v) },
        midTarget: { value: config.reactivity.midTarget, options: TARGET_OPTIONS, onChange: (v) => patch(['reactivity', 'midTarget'], v) },
        trebleTarget: { value: config.reactivity.trebleTarget, options: TARGET_OPTIONS, onChange: (v) => patch(['reactivity', 'trebleTarget'], v) },
      },
      { collapsed: true },
    ),
    Bloom: folder(
      {
        bloomEnabled: { value: config.effects.bloom.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'bloom', 'enabled'], v) },
        bloomIntensity: { value: config.effects.bloom.intensity, label: 'intensity', min: 0, max: 3, step: 0.01, onChange: (v) => patch(['effects', 'bloom', 'intensity'], v) },
        bloomThreshold: { value: config.effects.bloom.threshold, label: 'threshold', min: 0, max: 1, step: 0.01, onChange: (v) => patch(['effects', 'bloom', 'threshold'], v) },
      },
      { collapsed: true },
    ),
    Grain: folder(
      {
        grainEnabled: { value: config.effects.grain.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'grain', 'enabled'], v) },
        grainOpacity: { value: config.effects.grain.opacity, label: 'opacity', min: 0, max: 1, step: 0.01, onChange: (v) => patch(['effects', 'grain', 'opacity'], v) },
      },
      { collapsed: true },
    ),
    'Chromatic Aberration': folder(
      {
        caEnabled: { value: config.effects.chromaticAberration.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'chromaticAberration', 'enabled'], v) },
        caOffset: { value: config.effects.chromaticAberration.offset, label: 'offset', min: 0, max: 0.02, step: 0.0005, onChange: (v) => patch(['effects', 'chromaticAberration', 'offset'], v) },
        caBeatKick: { value: config.effects.chromaticAberration.beatKick, label: 'beatKick', min: 0, max: 1, step: 0.01, onChange: (v) => patch(['effects', 'chromaticAberration', 'beatKick'], v) },
      },
      { collapsed: true },
    ),
    Glitch: folder(
      {
        glitchEnabled: { value: config.effects.glitch.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'glitch', 'enabled'], v) },
        glitchIntensity: { value: config.effects.glitch.intensity, label: 'intensity', min: 0, max: 1, step: 0.01, onChange: (v) => patch(['effects', 'glitch', 'intensity'], v) },
      },
      { collapsed: true },
    ),
    Kaleidoscope: folder(
      {
        kaleidoEnabled: { value: config.effects.kaleidoscope.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'kaleidoscope', 'enabled'], v) },
        kaleidoSegments: { value: config.effects.kaleidoscope.segments, label: 'segments', min: 0, max: 24, step: 1, onChange: (v) => patch(['effects', 'kaleidoscope', 'segments'], v) },
        kaleidoTwist: { value: config.effects.kaleidoscope.twist, label: 'twist', min: 0, max: 2, step: 0.01, onChange: (v) => patch(['effects', 'kaleidoscope', 'twist'], v) },
      },
      { collapsed: true },
    ),
  })

  return null
}

/** leva control panel bound to the config store. */
export function ControlsPanel() {
  const applyPreset = useConfigStore((s) => s.applyPreset)
  const presetVersion = useConfigStore((s) => s.presetVersion)

  useControls('Vibe', {
    preset: {
      options: PRESET_OPTIONS,
      value: useConfigStore.getState().activePreset ?? 'default',
      onChange: (key) => applyPreset(key as PresetKey),
    },
  })

  return (
    <>
      <Leva collapsed />
      <ParameterControls key={presetVersion} />
    </>
  )
}
