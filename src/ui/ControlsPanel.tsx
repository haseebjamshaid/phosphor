import { Leva, folder, useControls } from 'leva'
import { useEffect } from 'react'
import { PRESET_OPTIONS, type PresetKey } from '../config/presets'
import type { ReactTarget, VisualizerConfig } from '../config/schema'
import { useConfigStore } from '../store/configStore'

const TARGET_OPTIONS: ReactTarget[] = ['scale', 'color', 'displacement', 'rotation', 'none']

/** Map the config to the flat leva input keys, for pushing presets into the panel. */
function flattenConfig(c: VisualizerConfig): Record<string, unknown> {
  return {
    background: c.palette.background,
    primary: c.palette.primary,
    secondary: c.palette.secondary,
    accent: c.palette.accent,
    oilSlick: c.elements.oilSlick,
    bokeh: c.elements.bokeh,
    sensitivity: c.reactivity.sensitivity,
    smoothing: c.reactivity.smoothing,
    beatSensitivity: c.reactivity.beatSensitivity,
    bassTarget: c.reactivity.bassTarget,
    midTarget: c.reactivity.midTarget,
    trebleTarget: c.reactivity.trebleTarget,
    bloomEnabled: c.effects.bloom.enabled,
    bloomIntensity: c.effects.bloom.intensity,
    bloomThreshold: c.effects.bloom.threshold,
    grainEnabled: c.effects.grain.enabled,
    grainOpacity: c.effects.grain.opacity,
    caEnabled: c.effects.chromaticAberration.enabled,
    caOffset: c.effects.chromaticAberration.offset,
    caBeatKick: c.effects.chromaticAberration.beatKick,
    glitchEnabled: c.effects.glitch.enabled,
    glitchIntensity: c.effects.glitch.intensity,
    kaleidoEnabled: c.effects.kaleidoscope.enabled,
    kaleidoSegments: c.effects.kaleidoscope.segments,
    kaleidoTwist: c.effects.kaleidoscope.twist,
  }
}

/**
 * Per-parameter controls bound to the config store. Each control patches its field
 * on change. NOT remounted on preset changes (that made leva re-fire stale onChange
 * handlers and clobber the preset); instead a store subscription pushes preset values
 * into the panel via leva's `set` whenever presetVersion bumps.
 */
function ParameterControls() {
  const patch = useConfigStore((s) => s.patch)

  const [, setLeva] = useControls(() => {
    const c = useConfigStore.getState().config
    return {
      Palette: folder(
        {
          background: { value: c.palette.background, onChange: (v) => patch(['palette', 'background'], v) },
          primary: { value: c.palette.primary, onChange: (v) => patch(['palette', 'primary'], v) },
          secondary: { value: c.palette.secondary, onChange: (v) => patch(['palette', 'secondary'], v) },
          accent: { value: c.palette.accent, onChange: (v) => patch(['palette', 'accent'], v) },
        },
        { collapsed: true },
      ),
      Elements: folder(
        {
          oilSlick: { value: c.elements.oilSlick, onChange: (v) => patch(['elements', 'oilSlick'], v) },
          bokeh: { value: c.elements.bokeh, onChange: (v) => patch(['elements', 'bokeh'], v) },
        },
        { collapsed: true },
      ),
      Reactivity: folder(
        {
          sensitivity: { value: c.reactivity.sensitivity, min: 0, max: 2, step: 0.01, onChange: (v) => patch(['reactivity', 'sensitivity'], v) },
          smoothing: { value: c.reactivity.smoothing, min: 0, max: 1, step: 0.01, onChange: (v) => patch(['reactivity', 'smoothing'], v) },
          beatSensitivity: { value: c.reactivity.beatSensitivity, min: 0, max: 1, step: 0.01, onChange: (v) => patch(['reactivity', 'beatSensitivity'], v) },
          bassTarget: { value: c.reactivity.bassTarget, options: TARGET_OPTIONS, onChange: (v) => patch(['reactivity', 'bassTarget'], v) },
          midTarget: { value: c.reactivity.midTarget, options: TARGET_OPTIONS, onChange: (v) => patch(['reactivity', 'midTarget'], v) },
          trebleTarget: { value: c.reactivity.trebleTarget, options: TARGET_OPTIONS, onChange: (v) => patch(['reactivity', 'trebleTarget'], v) },
        },
        { collapsed: true },
      ),
      Bloom: folder(
        {
          bloomEnabled: { value: c.effects.bloom.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'bloom', 'enabled'], v) },
          bloomIntensity: { value: c.effects.bloom.intensity, label: 'intensity', min: 0, max: 3, step: 0.01, onChange: (v) => patch(['effects', 'bloom', 'intensity'], v) },
          bloomThreshold: { value: c.effects.bloom.threshold, label: 'threshold', min: 0, max: 1, step: 0.01, onChange: (v) => patch(['effects', 'bloom', 'threshold'], v) },
        },
        { collapsed: true },
      ),
      Grain: folder(
        {
          grainEnabled: { value: c.effects.grain.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'grain', 'enabled'], v) },
          grainOpacity: { value: c.effects.grain.opacity, label: 'opacity', min: 0, max: 1, step: 0.01, onChange: (v) => patch(['effects', 'grain', 'opacity'], v) },
        },
        { collapsed: true },
      ),
      'Chromatic Aberration': folder(
        {
          caEnabled: { value: c.effects.chromaticAberration.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'chromaticAberration', 'enabled'], v) },
          caOffset: { value: c.effects.chromaticAberration.offset, label: 'offset', min: 0, max: 0.02, step: 0.0005, onChange: (v) => patch(['effects', 'chromaticAberration', 'offset'], v) },
          caBeatKick: { value: c.effects.chromaticAberration.beatKick, label: 'beatKick', min: 0, max: 1, step: 0.01, onChange: (v) => patch(['effects', 'chromaticAberration', 'beatKick'], v) },
        },
        { collapsed: true },
      ),
      Glitch: folder(
        {
          glitchEnabled: { value: c.effects.glitch.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'glitch', 'enabled'], v) },
          glitchIntensity: { value: c.effects.glitch.intensity, label: 'intensity', min: 0, max: 1, step: 0.01, onChange: (v) => patch(['effects', 'glitch', 'intensity'], v) },
        },
        { collapsed: true },
      ),
      Kaleidoscope: folder(
        {
          kaleidoEnabled: { value: c.effects.kaleidoscope.enabled, label: 'enabled', onChange: (v) => patch(['effects', 'kaleidoscope', 'enabled'], v) },
          kaleidoSegments: { value: c.effects.kaleidoscope.segments, label: 'segments', min: 0, max: 24, step: 1, onChange: (v) => patch(['effects', 'kaleidoscope', 'segments'], v) },
          kaleidoTwist: { value: c.effects.kaleidoscope.twist, label: 'twist', min: 0, max: 2, step: 0.01, onChange: (v) => patch(['effects', 'kaleidoscope', 'twist'], v) },
        },
        { collapsed: true },
      ),
    }
  }, [patch])

  useEffect(() => {
    let prevVersion = useConfigStore.getState().presetVersion
    return useConfigStore.subscribe((state) => {
      if (state.presetVersion !== prevVersion) {
        prevVersion = state.presetVersion
        ;(setLeva as (values: Record<string, unknown>) => void)(flattenConfig(state.config))
      }
    })
  }, [setLeva])

  return null
}

/** leva control panel bound to the config store. */
export function ControlsPanel() {
  const applyPreset = useConfigStore((s) => s.applyPreset)

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
      <ParameterControls />
    </>
  )
}
