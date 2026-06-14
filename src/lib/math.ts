/** Constrain a value to the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Constrain a value to [0, 1]. */
export function clamp01(value: number): number {
  return clamp(value, 0, 1)
}

/** Linear interpolation from a to b by t (t is not clamped). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Hermite smoothstep: 0 below edge0, 1 above edge1, smooth S-curve between. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) return x < edge0 ? 0 : 1
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Arithmetic mean of an array; returns 0 for an empty array. */
export function mean(values: readonly number[]): number {
  if (values.length === 0) return 0
  let sum = 0
  for (const v of values) sum += v
  return sum / values.length
}

/**
 * Frame-rate-independent exponential smoothing toward a target.
 *
 * `halfLifeSeconds` is the time for the gap between current and target to halve.
 * With delta = 0 the value is unchanged; with a large delta it approaches target.
 */
export function expSmooth(
  current: number,
  target: number,
  halfLifeSeconds: number,
  delta: number,
): number {
  if (halfLifeSeconds <= 0 || delta <= 0) {
    return halfLifeSeconds <= 0 ? target : current
  }
  const factor = 1 - Math.pow(2, -delta / halfLifeSeconds)
  return current + (target - current) * factor
}
