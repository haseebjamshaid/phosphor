import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { DPR_MAX } from '../lib/constants'
import { useConfigStore } from '../store/configStore'
import { FrameDriver } from './FrameDriver'

/**
 * Phase 0 placeholder: a slowly rotating mesh that proves the r3f render loop,
 * lighting, and DPR clamp are wired correctly. Replaced by real elements in later phases.
 */
function PlaceholderMesh() {
  const meshRef = useRef<Mesh>(null)
  const primary = useConfigStore((s) => s.config.palette.primary)

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.rotation.x += delta * 0.3
    mesh.rotation.y += delta * 0.5
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={primary}
        emissive={primary}
        emissiveIntensity={0.15}
        roughness={0.4}
        metalness={0.6}
      />
    </mesh>
  )
}

export function Visualizer() {
  const background = useConfigStore((s) => s.config.palette.background)

  return (
    <Canvas
      dpr={[1, DPR_MAX]}
      camera={{ position: [0, 0, 4], fov: 50 }}
      gl={{ antialias: true }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <FrameDriver />
      <color attach="background" args={[background]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={60} color="#6ea8ff" />
      <PlaceholderMesh />
    </Canvas>
  )
}
