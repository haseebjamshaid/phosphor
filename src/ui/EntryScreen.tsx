import { useAudioEngine } from '../hooks/useAudioEngine'
import { useUiStore } from '../store/uiStore'

/**
 * The branded front door. The Enter click is the user gesture that unlocks the
 * AudioContext and starts the idle self-animation (the cold open) for every visitor.
 */
export function EntryScreen() {
  const enter = useUiStore((s) => s.enter)
  const { startIdle } = useAudioEngine()

  const handleEnter = () => {
    enter()
    void startIdle()
  }

  return (
    <div className="entry">
      <div className="entry__inner">
        <h1 className="entry__title">phosphor</h1>
        <p className="entry__tagline">a music-reactive light</p>
        <button type="button" className="entry__enter" onClick={handleEnter}>
          Enter
        </button>
      </div>
    </div>
  )
}
