import { useEngineConfigSync } from './hooks/useEngineConfigSync'
import { SHOW_DEBUG } from './lib/constants'
import { Visualizer } from './scene/Visualizer'
import { useUiStore } from './store/uiStore'
import { ControlsPanel } from './ui/ControlsPanel'
import { EntryScreen } from './ui/EntryScreen'
import { ErrorToast } from './ui/ErrorToast'
import { FftDebugBars } from './ui/FftDebugBars'
import { SourcePicker } from './ui/SourcePicker'
import { Toolbar } from './ui/Toolbar'

function App() {
  useEngineConfigSync()
  const entered = useUiStore((s) => s.entered)

  return (
    <>
      <Visualizer />
      {!entered && <EntryScreen />}
      {entered && (
        <>
          <Toolbar />
          <ControlsPanel />
          <SourcePicker />
          <ErrorToast />
          {SHOW_DEBUG && <FftDebugBars />}
        </>
      )}
    </>
  )
}

export default App
