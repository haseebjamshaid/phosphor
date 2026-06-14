import { useCallback, useRef, useState } from 'react'
import { useAudioEngine } from '../hooks/useAudioEngine'
import { useRuntimeStore } from '../store/runtimeStore'

/**
 * Phase 1 source UI: drop or pick an audio file to start the engine. Hidden once
 * the engine is live. Superseded by the full SourcePicker in Phase 8.
 */
export function FileDrop() {
  const { startFile } = useAudioEngine()
  const status = useRuntimeStore((s) => s.status)
  const error = useRuntimeStore((s) => s.error)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (file) void startFile(file)
    },
    [startFile],
  )

  if (status === 'live') return null

  return (
    <div
      className={`file-drop${dragging ? ' file-drop--active' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <div className="file-drop__card">
        <h1 className="file-drop__title">phosphor</h1>
        <p className="file-drop__hint">
          {status === 'connecting' ? 'Connecting…' : 'Drop an audio file to begin'}
        </p>
        <button type="button" onClick={() => inputRef.current?.click()}>
          Choose a track
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        {error && <p className="file-drop__error">{error}</p>}
      </div>
    </div>
  )
}
