export interface Capabilities {
  /** System/tab audio capture (getDisplayMedia) — Chromium desktop only. */
  system: boolean
  /** File playback (needs an AudioContext). */
  file: boolean
  /** Idle self-animation — always available. */
  idle: boolean
}

interface NavigatorLike {
  mediaDevices?: { getDisplayMedia?: unknown }
  userAgent?: string
  userAgentData?: { brands?: { brand: string }[] }
}

interface WindowLike {
  AudioContext?: unknown
  webkitAudioContext?: unknown
}

/** True for Chromium-family browsers (Chrome, Edge), which support display-audio capture. */
export function isChromium(nav: NavigatorLike): boolean {
  const brands = nav.userAgentData?.brands
  if (brands && brands.length > 0) {
    return brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/i.test(b.brand))
  }
  const ua = nav.userAgent ?? ''
  // Exclude Firefox/Safari which lack reliable display-audio support.
  return /Chrome|Chromium|Edg\//i.test(ua) && !/Firefox|FxiOS/i.test(ua)
}

/** True for mobile browsers, which do not support audio capture at all. */
export function isMobile(nav: NavigatorLike): boolean {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent ?? '')
}

/** Determine which audio sources are usable in the current environment. */
export function detectCapabilities(nav: NavigatorLike, win: WindowLike): Capabilities {
  const hasAudioContext =
    typeof win.AudioContext !== 'undefined' || typeof win.webkitAudioContext !== 'undefined'
  const system = Boolean(nav.mediaDevices?.getDisplayMedia) && isChromium(nav) && !isMobile(nav)
  return { system, file: hasAudioContext, idle: true }
}
