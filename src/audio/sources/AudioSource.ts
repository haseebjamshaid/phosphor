import type { AudioFrame } from '../audioFrame'

/** A swappable audio input. Connects into the engine's AnalyserNode. */
export type AudioSourceKind = 'file' | 'system' | 'mic' | 'idle'

export interface AudioSource {
  readonly kind: AudioSourceKind
  /**
   * Wire this source into the given context and return the node to connect to the
   * analyser. May start playback. Throws on failure (e.g. no audio track shared).
   * Synthetic sources (idle) have no real node and return null.
   */
  connect(context: AudioContext): Promise<AudioNode | null>
  /** Tear down: stop playback, disconnect nodes, release resources. */
  dispose(): void
  /**
   * Optional. Synthetic sources implement this to fill the AudioFrame directly each
   * frame instead of being read from the analyser.
   */
  sample?(frame: AudioFrame, delta: number): void
}
