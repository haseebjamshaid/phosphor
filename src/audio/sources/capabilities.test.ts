import { describe, expect, it } from 'vitest'
import { detectCapabilities, isChromium } from './capabilities'

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36'
const SAFARI_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
const FIREFOX_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0'
const ANDROID_CHROME_UA =
  'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36'

const displayMedia = { mediaDevices: { getDisplayMedia: () => {} } }
const win = { AudioContext: class {} }

describe('isChromium', () => {
  it('detects Chrome via userAgentData brands', () => {
    expect(isChromium({ userAgentData: { brands: [{ brand: 'Google Chrome' }] } })).toBe(true)
  })

  it('detects Chrome via user agent string', () => {
    expect(isChromium({ userAgent: CHROME_UA })).toBe(true)
  })

  it('rejects Safari and Firefox', () => {
    expect(isChromium({ userAgent: SAFARI_UA })).toBe(false)
    expect(isChromium({ userAgent: FIREFOX_UA })).toBe(false)
  })
})

describe('detectCapabilities', () => {
  it('enables system audio on Chromium desktop', () => {
    const caps = detectCapabilities({ ...displayMedia, userAgent: CHROME_UA }, win)
    expect(caps).toEqual({ system: true, file: true, idle: true })
  })

  it('disables system audio on Safari', () => {
    const caps = detectCapabilities({ ...displayMedia, userAgent: SAFARI_UA }, win)
    expect(caps.system).toBe(false)
    expect(caps.idle).toBe(true)
  })

  it('disables system audio on mobile Chrome', () => {
    const caps = detectCapabilities({ ...displayMedia, userAgent: ANDROID_CHROME_UA }, win)
    expect(caps.system).toBe(false)
  })

  it('disables system audio when getDisplayMedia is missing', () => {
    const caps = detectCapabilities({ userAgent: CHROME_UA }, win)
    expect(caps.system).toBe(false)
  })

  it('reports file support based on AudioContext availability', () => {
    expect(detectCapabilities({ userAgent: CHROME_UA }, {}).file).toBe(false)
    expect(detectCapabilities({ userAgent: CHROME_UA }, win).file).toBe(true)
  })

  it('always allows idle', () => {
    expect(detectCapabilities({}, {}).idle).toBe(true)
  })
})
