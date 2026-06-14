import { useEngineConfigSync } from './hooks/useEngineConfigSync'
import { SHOW_DEBUG } from './lib/constants'
import { Visualizer } from './scene/Visualizer'
import { ControlsPanel } from './ui/ControlsPanel'
import { FftDebugBars } from './ui/FftDebugBars'
import { SourcePicker } from './ui/SourcePicker'

function App() {
  useEngineConfigSync()

  return (
    <>
      <Visualizer />
      <ControlsPanel />
      <SourcePicker />
      {SHOW_DEBUG && <FftDebugBars />}
    </>
  )
}

export default App
