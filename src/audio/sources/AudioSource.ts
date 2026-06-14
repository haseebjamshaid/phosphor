/** A swappable audio input. Connects into the engine's AnalyserNode. */
export type AudioSourceKind = 'file' | 'system' | 'mic' | 'idle'

export interface AudioSource {
  readonly kind: AudioSourceKind
  /**
   * Wire this source into the given context and return the node to connect to the
   * analyser. May start playback. Throws on failure (e.g. no audio track shared).
   */
  connect(context: AudioContext): Promise<AudioNode>
  /** Tear down: stop playback, disconnect nodes, release resources. */
  dispose(): void
}
