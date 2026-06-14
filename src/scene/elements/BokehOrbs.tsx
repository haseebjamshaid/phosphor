import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute } from 'three'
import { useConfigStore } from '../../store/configStore'
import { BokehMaterial } from '../materials/bokehMaterial'
import { useAudioFrame } from '../useAudioFrame'

const ORB_COUNT = 140

// Random orb layout, generated once at module load (kept out of render so the
// useMemo below stays pure). A fixed layout across remounts is fine here.
const ORB_LAYOUT = (() => {
  const positions = new Float32Array(ORB_COUNT * 3)
  const seeds = new Float32Array(ORB_COUNT)
  const scales = new Float32Array(ORB_COUNT)
  for (let i = 0; i < ORB_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 8
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1
    seeds[i] = Math.random()
    scales[i] = 0.4 + Math.random() * 1.2
  }
  return { positions, seeds, scales }
})()

/**
 * Drifting soft blue glow orbs. Size pulses with bass, brightness with overall level.
 * Geometry is built once and disposed on unmount.
 */
export function BokehOrbs() {
  const materialRef = useRef<InstanceType<typeof BokehMaterial>>(null)
  const travel = useRef(0)
  const frame = useAudioFrame()
  const primary = useConfigStore((s) => s.config.palette.primary)

  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    geo.setAttribute('position', new Float32BufferAttribute(ORB_LAYOUT.positions, 3))
    geo.setAttribute('aSeed', new Float32BufferAttribute(ORB_LAYOUT.seeds, 1))
    geo.setAttribute('aScale', new Float32BufferAttribute(ORB_LAYOUT.scales, 1))
    return geo
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((_, delta) => {
    const material = materialRef.current
    if (!material) return
    material.uColor.set(primary)

    const level = frame?.level ?? 0
    const beat = frame?.beatEnergy ?? 0
    // Warp speed ramps with the SQUARE of energy — calm in the verses, a rush on the drop.
    const warpSpeed = 0.3 + level * level * 14 + beat * 6
    travel.current += warpSpeed * delta

    material.uTravel = travel.current
    material.uTime = frame ? frame.t : material.uTime + delta
    material.uBass = frame?.bass ?? 0
    material.uBeat = beat
    material.uLevel = level
  })

  return (
    <points geometry={geometry}>
      <bokehMaterial ref={materialRef} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  )
}
