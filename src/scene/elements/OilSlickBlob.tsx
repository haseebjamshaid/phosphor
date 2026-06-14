import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { useConfigStore } from '../../store/configStore'
import { OilSlickMaterial } from '../materials/oilSlickMaterial'
import { computeTargets } from '../reactivity'
import { useAudioFrame } from '../useAudioFrame'

/**
 * The iridescent centerpiece. Reads the live AudioFrame inside useFrame and pushes
 * values straight to shader uniforms — never through React state. Drifts gently when
 * no audio is connected so the scene always looks alive.
 */
export function OilSlickBlob() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<InstanceType<typeof OilSlickMaterial>>(null)
  const frame = useAudioFrame()
  const palette = useConfigStore((s) => s.config.palette)
  const reactivity = useConfigStore((s) => s.config.reactivity)

  useFrame((_, delta) => {
    const material = materialRef.current
    const mesh = meshRef.current
    if (!material || !mesh) return

    material.uPrimary.set(palette.primary)
    material.uSecondary.set(palette.secondary)
    material.uAccent.set(palette.accent)

    mesh.rotation.y += delta * 0.05
    mesh.rotation.x += delta * 0.02

    if (!frame) {
      material.uTime += delta
      return
    }

    const targets = computeTargets(frame, reactivity)
    material.uTime = frame.t
    material.uBass = frame.bass
    material.uMid = frame.mid
    material.uTreble = frame.treble
    material.uBeat = frame.beatEnergy
    material.uDisplacement = targets.displacement
    material.uColorShift = targets.color
    mesh.scale.setScalar(1 + targets.scale * 0.4)
    mesh.rotation.y += delta * targets.rotation * 0.5
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.1, 6]} />
      <oilSlickMaterial ref={materialRef} />
    </mesh>
  )
}
