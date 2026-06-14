import { SHOW_DEBUG } from './lib/constants'
import { Visualizer } from './scene/Visualizer'
import { FftDebugBars } from './ui/FftDebugBars'
import { FileDrop } from './ui/FileDrop'

function App() {
  return (
    <>
      <Visualizer />
      <FileDrop />
      {SHOW_DEBUG && <FftDebugBars />}
    </>
  )
}

export default App
