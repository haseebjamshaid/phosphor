import { Canvas } from '@react-three/fiber'
import { DPR_MAX } from '../lib/constants'
import { useConfigStore } from '../store/configStore'
import { PostStack } from './effects/PostStack'
import { OilSlickBlob } from './elements/OilSlickBlob'
import { FrameDriver } from './FrameDriver'

/** The audio-reactive elements, each toggled by its config flag. */
function SceneElements() {
  const oilSlick = useConfigStore((s) => s.config.elements.oilSlick)
  return <>{oilSlick && <OilSlickBlob />}</>
}

export function Visualizer() {
  const background = useConfigStore((s) => s.config.palette.background)

  return (
    <Canvas
      dpr={[1, DPR_MAX]}
      camera={{ position: [0, 0, 3.2], fov: 50 }}
      gl={{ antialias: true }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <FrameDriver />
      <color attach="background" args={[background]} />
      <SceneElements />
      <PostStack />
    </Canvas>
  )
}
