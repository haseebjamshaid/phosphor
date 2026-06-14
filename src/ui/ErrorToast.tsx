import { useEffect } from 'react'
import { useRuntimeStore } from '../store/runtimeStore'

const DISMISS_MS = 5000

/** Surfaces engine errors (e.g. declined share prompt) as an auto-dismissing toast. */
export function ErrorToast() {
  const error = useRuntimeStore((s) => s.error)
  const setError = useRuntimeStore((s) => s.setError)

  useEffect(() => {
    if (!error) return
    const id = setTimeout(() => setError(null), DISMISS_MS)
    return () => clearTimeout(id)
  }, [error, setError])

  if (!error) return null

  return (
    <div className="toast" role="alert">
      <span>{error}</span>
      <button type="button" onClick={() => setError(null)} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}
