import { Canvas, useFrame } from '@react-three/fiber'
import type { PerspectiveCamera } from 'three'
import { DPR_MAX } from '../lib/constants'
import { useConfigStore } from '../store/configStore'
import { PostStack } from './effects/PostStack'
import { BokehOrbs } from './elements/BokehOrbs'
import { OilSlickBlob } from './elements/OilSlickBlob'
import { FrameDriver } from './FrameDriver'
import { useAudioFrame } from './useAudioFrame'

const BASE_CAMERA_Z = 3.2
const BASE_FOV = 50

/** The audio-reactive elements, each toggled by its config flag. */
function SceneElements() {
  const oilSlick = useConfigStore((s) => s.config.elements.oilSlick)
  const bokeh = useConfigStore((s) => s.config.elements.bokeh)
  return (
    <>
      {oilSlick && <OilSlickBlob />}
      {bokeh && <BokehOrbs />}
    </>
  )
}

/**
 * Dives the camera and widens the FOV with energy and beats — the "falling through
 * space" motion. Reads the loudness-gated signals, so it's still in quiet passages.
 */
function CameraRig() {
  const frame = useAudioFrame()
  useFrame((state, delta) => {
    const level = frame?.level ?? 0
    const beat = frame?.beatEnergy ?? 0
    const camera = state.camera
    const targetZ = BASE_CAMERA_Z - level * 0.8 - beat * 0.3
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 6)
    const cam = camera as PerspectiveCamera
    if (cam.isPerspectiveCamera) {
      const targetFov = BASE_FOV + level * 12 + beat * 8
      cam.fov += (targetFov - cam.fov) * Math.min(1, delta * 8)
      cam.updateProjectionMatrix()
    }
  })
  return null
}

export function Visualizer() {
  const background = useConfigStore((s) => s.config.palette.background)

  return (
    <Canvas
      dpr={[1, DPR_MAX]}
      camera={{ position: [0, 0, BASE_CAMERA_Z], fov: BASE_FOV }}
      gl={{ antialias: true }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <FrameDriver />
      <CameraRig />
      <color attach="background" args={[background]} />
      <SceneElements />
      <PostStack />
    </Canvas>
  )
}
