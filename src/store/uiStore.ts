import { create } from 'zustand'

interface UiState {
  /** True once the user has clicked Enter (which unlocks audio). */
  entered: boolean
  /** Whether the source-picker overlay is open. */
  pickerOpen: boolean
  enter: () => void
  openPicker: () => void
  closePicker: () => void
}

export const useUiStore = create<UiState>((set) => ({
  entered: false,
  pickerOpen: false,
  // Entering reveals the source picker over the (already drifting) idle visuals.
  enter: () => set({ entered: true, pickerOpen: true }),
  openPicker: () => set({ pickerOpen: true }),
  closePicker: () => set({ pickerOpen: false }),
}))
