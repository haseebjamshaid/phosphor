import { useCallback, useMemo, useRef, useState } from 'react'
import { detectCapabilities } from '../audio/sources/capabilities'
import { useAudioEngine } from '../hooks/useAudioEngine'
import { useRuntimeStore } from '../store/runtimeStore'
import { useUiStore } from '../store/uiStore'

/**
 * Source selection overlay, opened from the toolbar. Offers system audio (Chromium
 * desktop only) and file playback (anywhere, also via drag-drop). Closing keeps the
 * idle visuals running. Errors surface via the global toast, not inline.
 */
export function SourcePicker() {
  const { startFile, startSystem } = useAudioEngine()
  const pickerOpen = useUiStore((s) => s.pickerOpen)
  const closePicker = useUiStore((s) => s.closePicker)
  const status = useRuntimeStore((s) => s.status)
  const caps = useMemo(() => detectCapabilities(navigator, window), [])
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const pickFile = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (file) {
        void startFile(file)
        closePicker()
      }
    },
    [startFile, closePicker],
  )

  if (!pickerOpen) return null

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
        pickFile(e.dataTransfer.files)
      }}
    >
      <div className="source-picker__card">
        <button
          type="button"
          className="source-picker__close"
          onClick={closePicker}
          aria-label="Close"
        >
          ×
        </button>
        <h1 className="source-picker__title">phosphor</h1>
        <p className="source-picker__hint">{connecting ? 'Connecting…' : 'Feed it sound'}</p>

        <div className="source-picker__actions">
          {caps.system && (
            <button
              type="button"
              disabled={connecting}
              onClick={() => {
                void startSystem()
                closePicker()
              }}
            >
              Connect system audio
            </button>
          )}
          <button type="button" disabled={connecting} onClick={() => inputRef.current?.click()}>
            Play an audio file
          </button>
          <button type="button" className="source-picker__ghost" onClick={closePicker}>
            Keep idle visuals
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) => pickFile(e.target.files)}
        />

        {!caps.system && (
          <p className="source-picker__note">
            System-audio capture needs Chrome or Edge on desktop. Drop a file or keep the idle
            visuals here.
          </p>
        )}
      </div>
    </div>
  )
}
