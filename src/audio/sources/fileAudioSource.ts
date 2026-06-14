import type { AudioSource } from './AudioSource'

/**
 * File-based source: plays an uploaded audio file through an <audio> element and
 * taps it via a MediaElementSourceNode. Connects to the destination so it is
 * audible. Used for development/testing and as a universal fallback.
 */
export function createFileAudioSource(file: File): AudioSource {
  const url = URL.createObjectURL(file)
  const element = new Audio(url)
  element.loop = true
  let node: MediaElementAudioSourceNode | null = null

  return {
    kind: 'file',
    async connect(context: AudioContext): Promise<AudioNode> {
      node = context.createMediaElementSource(element)
      // Audible playback in addition to feeding the analyser.
      node.connect(context.destination)
      await element.play()
      return node
    },
    dispose(): void {
      element.pause()
      node?.disconnect()
      element.removeAttribute('src')
      URL.revokeObjectURL(url)
    },
  }
}
