import { useCallback, useEffect, useState } from 'react'

interface UseFullscreen {
  isFullscreen: boolean
  toggle: () => void
}

/** Track and toggle document fullscreen. */
export function useFullscreen(): UseFullscreen {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen()
    }
  }, [])

  return { isFullscreen, toggle }
}
