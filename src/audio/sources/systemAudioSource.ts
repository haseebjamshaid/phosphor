import type { AudioSource } from './AudioSource'

/** Thrown when the user shares a screen/tab but does not enable the audio checkbox. */
export class NoSystemAudioError extends Error {
  constructor() {
    super('No audio was shared. Re-share and tick the "Share tab/system audio" checkbox.')
    this.name = 'NoSystemAudioError'
  }
}

/**
 * Hero source: captures system/tab audio via getDisplayMedia. Chromium desktop only.
 * Requests video (audio-only capture is rejected), immediately stops the video track,
 * and feeds the audio into the analyser. Never connects to the destination (no echo).
 */
export function createSystemAudioSource(onEnded?: () => void): AudioSource {
  let stream: MediaStream | null = null
  let node: MediaStreamAudioSourceNode | null = null

  return {
    kind: 'system',
    async connect(context: AudioContext): Promise<AudioNode | null> {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })

      // We only want audio: kill the mandatory video track right away.
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.stop()
        stream.removeTrack(videoTrack)
      }

      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length === 0) {
        stream.getTracks().forEach((track) => track.stop())
        stream = null
        throw new NoSystemAudioError()
      }

      // Fall back when the user clicks the browser's "Stop sharing" bar.
      audioTracks[0].addEventListener('ended', () => onEnded?.())

      node = context.createMediaStreamSource(stream)
      return node
    },
    dispose(): void {
      node?.disconnect()
      node = null
      stream?.getTracks().forEach((track) => track.stop())
      stream = null
    },
  }
}
