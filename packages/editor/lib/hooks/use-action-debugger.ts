import { useCallback, useEffect } from "react"
import { create } from "zustand"
import { useDebugMode } from "./use-debug-mode"

interface ActionDebuggerState {
  showActionDebugger: boolean
  setShowActionDebugger: (showActionDebugger: boolean) => void
}

const useStore = create<ActionDebuggerState>((set) => ({
  showActionDebugger: false,
  setShowActionDebugger: (showActionDebugger) =>
    set((state) => ({ ...state, showActionDebugger })),
}))

export function useActionDebugger() {
  const { showActionDebugger, setShowActionDebugger } = useStore()
  const { debugModeEnabled } = useDebugMode()

  const toggleActionDebugger = useCallback(() => {
    setShowActionDebugger(!showActionDebugger)
  }, [setShowActionDebugger, showActionDebugger])

  // Disable action debugger when debug mode is disabled
  useEffect(() => {
    if (!debugModeEnabled && showActionDebugger) {
      setShowActionDebugger(false)
    }
  }, [debugModeEnabled, setShowActionDebugger, showActionDebugger])

  return { showActionDebugger, toggleActionDebugger }
}
