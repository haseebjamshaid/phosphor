/** Cap device pixel ratio so heavy postprocessing stays performant on Retina displays. */
export const DPR_MAX = 1.5

/** Near-black canvas clear color — the dark void the visuals emerge from. */
export const BACKGROUND_COLOR = '#05060a'

// --- Audio analysis ---

/** AnalyserNode FFT window. 2048 → 1024 frequency bins; good balance of detail vs cost. */
export const FFT_SIZE = 2048

/** Browser-side temporal smoothing applied by the AnalyserNode (0..1). */
export const ANALYSER_SMOOTHING = 0.8

/** Half-life (seconds) for our extra exponential smoothing of band energies. */
export const BAND_HALF_LIFE = 0.06

/**
 * Absolute-loudness window (RMS) mapped 0..1. Below FLOOR a passage reads as "quiet",
 * above CEIL as "full intensity". This drives the BEAT punch and the band floor-lift —
 * soft passages don't punch, loud sections erupt. Kept low/narrow so a normal singing
 * verse already reads near-full (a quiet song should still clearly react).
 */
export const INTENSITY_FLOOR = 0.03
export const INTENSITY_CEIL = 0.18

/**
 * Floor for band reactivity: even in near-silence the bands react at this fraction, so
 * the form always flows with the melody and the singer's voice. Loudness lifts it to 1.
 */
export const QUIET_REACTIVITY = 0.5

/** Frequency ranges (Hz) reduced into the three reactive bands. */
export const BAND_RANGES = {
  bass: [20, 250],
  mid: [250, 2000],
  treble: [2000, 8000],
} as const

// --- Beat detection ---

/** How fast beatEnergy decays back to 0 (units/second). */
export const BEAT_DECAY = 3.5

export const BEAT_DEFAULTS = {
  /** Rolling energy-history length (~0.7s at 60fps). */
  historySize: 43,
  /** Minimum frames of history before a beat can fire. */
  minHistory: 8,
  /** Instant energy must exceed avg * thresholdMultiplier to count as a beat. */
  thresholdMultiplier: 1.4,
  /** Refractory period (ms) between beats, preventing double-fires. */
  minIntervalMs: 120,
  /** Energy floor so silence/near-silence never registers a beat. */
  minEnergy: 0.04,
} as const

// --- Debug ---

/** Show the FFT debug bars overlay. Flip to true while developing audio reactivity. */
export const SHOW_DEBUG = false
