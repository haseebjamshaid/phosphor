import { useFrame } from '@react-three/fiber'
import { useRuntimeStore } from '../store/runtimeStore'

/**
 * The single per-frame pump. Must be mounted FIRST inside <Canvas> so its default-
 * priority useFrame runs before any visual element reads the AudioFrame. Renders
 * nothing and never re-renders per frame.
 */
export function FrameDriver() {
  const engine = useRuntimeStore((s) => s.engine)

  useFrame((_, delta) => {
    engine?.tick(delta)
  })

  return null
}
