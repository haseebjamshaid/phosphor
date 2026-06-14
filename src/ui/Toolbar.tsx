import { PRESETS, type PresetKey } from '../config/presets'
import { useFullscreen } from '../hooks/useFullscreen'
import { useConfigStore } from '../store/configStore'
import { useUiStore } from '../store/uiStore'

const PRESET_KEYS = Object.keys(PRESETS) as PresetKey[]

/** Persistent top bar: preset switcher, audio-source picker trigger, fullscreen. */
export function Toolbar() {
  const activePreset = useConfigStore((s) => s.activePreset)
  const applyPreset = useConfigStore((s) => s.applyPreset)
  const openPicker = useUiStore((s) => s.openPicker)
  const { isFullscreen, toggle } = useFullscreen()

  return (
    <div className="toolbar">
      <div className="toolbar__group">
        {PRESET_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={`chip${activePreset === key ? ' chip--active' : ''}`}
            onClick={() => applyPreset(key)}
          >
            {PRESETS[key].name}
          </button>
        ))}
      </div>
      <div className="toolbar__group">
        <button type="button" className="chip" onClick={openPicker}>
          Audio
        </button>
        <button type="button" className="chip" onClick={toggle} aria-label="Toggle fullscreen">
          {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  )
}
