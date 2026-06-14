import { useEffect, useRef } from 'react'
import { useRuntimeStore } from '../store/runtimeStore'

const WIDTH = 512
const HEIGHT = 140
const BAR_COUNT = 96
const METER_LABELS = ['bass', 'mid', 'treble'] as const
const METER_COLORS = ['#ff5d73', '#6ea8ff', '#7cffcb']

function drawMeter(
  ctx: CanvasRenderingContext2D,
  label: string,
  value: number,
  index: number,
  color: string,
): void {
  const x = 8 + index * 96
  const y = HEIGHT - 10
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '9px monospace'
  ctx.fillText(`${label} ${value.toFixed(2)}`, x, y - 4)
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.strokeRect(x, y, 80, 6)
  ctx.fillStyle = color
  ctx.fillRect(x, y, Math.min(1, value) * 80, 6)
}

/**
 * Phase 1 debug overlay: a plain DOM canvas drawing the live spectrum, band meters,
 * and beat indicator. Runs its own rAF reading the engine frame NON-reactively, so
 * it never triggers React re-renders. Removed/flagged off for the polished build.
 */
export function FftDebugBars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const render = () => {
      raf = requestAnimationFrame(render)
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      const engine = useRuntimeStore.getState().engine
      if (!engine) return
      const { freq, bass, mid, treble, beat, beatEnergy } = engine.frame

      const step = Math.max(1, Math.floor(freq.length / BAR_COUNT))
      const barW = WIDTH / BAR_COUNT
      for (let i = 0; i < BAR_COUNT; i++) {
        const v = freq[i * step] / 255
        const h = v * (HEIGHT - 34)
        ctx.fillStyle = `hsl(${200 + v * 110}, 85%, ${28 + v * 42}%)`
        ctx.fillRect(i * barW, HEIGHT - 26 - h, barW - 1, h)
      }

      const bands = [bass, mid, treble]
      for (let i = 0; i < METER_LABELS.length; i++) {
        drawMeter(ctx, METER_LABELS[i], bands[i], i, METER_COLORS[i])
      }

      ctx.fillStyle = beat ? '#ffffff' : `rgba(255,255,255,${0.12 + beatEnergy * 0.6})`
      ctx.beginPath()
      ctx.arc(WIDTH - 14, 14, 7, 0, Math.PI * 2)
      ctx.fill()
    }
    raf = requestAnimationFrame(render)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="fft-debug" width={WIDTH} height={HEIGHT} />
}
