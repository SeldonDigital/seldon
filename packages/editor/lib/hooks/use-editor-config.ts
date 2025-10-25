import { useCallback } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface EditorConfigState {
  // Wireframe settings
  wireframeMode: "auto" | "on" | "off"
  toggleWireframeMode: (mode?: "on" | "off") => void

  // Panel settings
  showPanels: boolean
  setShowPanels: (showPanels: boolean) => void

  // Auto-scroll settings
  autoScrollToSelection: boolean
  setAutoScrollToSelection: (enabled: boolean) => void

  // Properties settings
  showUnusedProperties: boolean
  setShowUnusedProperties: (enabled: boolean) => void
}

const useStore = create<EditorConfigState>()(
  persist(
    (set) => ({
      // Wireframe settings
      wireframeMode: "auto",
      toggleWireframeMode: (mode) =>
        set((state) => {
          const newMode =
            mode ??
            (state.wireframeMode === "auto" || state.wireframeMode === "off"
              ? "on"
              : "off")

          return { ...state, wireframeMode: newMode }
        }),

      // Panel settings
      showPanels: true,
      setShowPanels: (showPanels) => set((state) => ({ ...state, showPanels })),

      // Auto-scroll settings
      autoScrollToSelection: true,
      setAutoScrollToSelection: (enabled) =>
        set((state) => ({ ...state, autoScrollToSelection: enabled })),

      // Properties settings
      showUnusedProperties: false,
      setShowUnusedProperties: (enabled) =>
        set((state) => ({ ...state, showUnusedProperties: enabled })),
    }),
    {
      name: "editor-config",
      partialize: (state) => ({
        wireframeMode: state.wireframeMode,
        showPanels: state.showPanels,
        autoScrollToSelection: state.autoScrollToSelection,
        showUnusedProperties: state.showUnusedProperties,
      }),
    },
  ),
)

export function useEditorConfig() {
  const {
    wireframeMode,
    toggleWireframeMode,
    showPanels,
    setShowPanels,
    autoScrollToSelection,
    setAutoScrollToSelection,
    showUnusedProperties,
    setShowUnusedProperties,
  } = useStore()

  const togglePanels = useCallback(() => {
    setShowPanels(!showPanels)
  }, [setShowPanels, showPanels])

  const toggleAutoScrollToSelection = useCallback(() => {
    setAutoScrollToSelection(!autoScrollToSelection)
  }, [setAutoScrollToSelection, autoScrollToSelection])

  const toggleShowUnusedProperties = useCallback(() => {
    setShowUnusedProperties(!showUnusedProperties)
  }, [setShowUnusedProperties, showUnusedProperties])

  return {
    // Wireframe methods
    wireframeMode,
    toggleWireframeMode,

    // Panel methods
    showPanels,
    setShowPanels,
    togglePanels,

    // Auto-scroll methods
    autoScrollToSelection,
    setAutoScrollToSelection,
    toggleAutoScrollToSelection,

    // Properties methods
    showUnusedProperties,
    setShowUnusedProperties,
    toggleShowUnusedProperties,
  }
}
