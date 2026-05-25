import { create } from "zustand"
import { persist } from "zustand/middleware"

interface DebugState {
  enabled: boolean
  toggle: (enable?: boolean) => void
}
export const useStore = create<DebugState>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: (enable) =>
        set((state) => {
          const newEnabled = enable ?? !state.enabled

          return { ...state, enabled: newEnabled }
        }),
    }),
    { name: "debug-mode" },
  ),
)

export function useDebugMode() {
  const { enabled, toggle } = useStore()

  return { toggleDebugMode: toggle, debugModeEnabled: enabled }
}
