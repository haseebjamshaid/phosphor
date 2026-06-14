import { useCallback, useMemo, useRef, useState } from 'react'
import { detectCapabilities } from '../audio/sources/capabilities'
import { useAudioEngine } from '../hooks/useAudioEngine'
import { useRuntimeStore } from '../store/runtimeStore'

/**
 * Source selection overlay. Offers system audio (Chromium desktop only), file
 * playback (anywhere, also via drag-drop), and the idle preview. Hidden once live.
 */
export function SourcePicker() {
  const { startFile, startSystem, startIdle } = useAudioEngine()
  const status = useRuntimeStore((s) => s.status)
  const error = useRuntimeStore((s) => s.error)
  const caps = useMemo(() => detectCapabilities(navigator, window), [])
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

  const connecting = status === 'connecting'

  return (
    <div
      className={`source-picker${dragging ? ' source-picker--active' : ''}`}
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
      <div className="source-picker__card">
        <h1 className="source-picker__title">phosphor</h1>
        <p className="source-picker__hint">{connecting ? 'Connecting…' : 'Feed it sound'}</p>

        <div className="source-picker__actions">
          {caps.system && (
            <button type="button" disabled={connecting} onClick={() => void startSystem()}>
              Connect system audio
            </button>
          )}
          <button type="button" disabled={connecting} onClick={() => inputRef.current?.click()}>
            Play an audio file
          </button>
          <button
            type="button"
            className="source-picker__ghost"
            disabled={connecting}
            onClick={() => void startIdle()}
          >
            Idle preview
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!caps.system && (
          <p className="source-picker__note">
            System-audio capture needs Chrome or Edge on desktop. Drop a file or use the idle
            preview here.
          </p>
        )}

        {error && <p className="source-picker__error">{error}</p>}
      </div>
    </div>
  )
}
