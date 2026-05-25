import { useCallback } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

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

  // Auto-expand settings
  autoExpandOnSelection: boolean
  setAutoExpandOnSelection: (enabled: boolean) => void

  // Properties settings
  showUnusedProperties: boolean
  setShowUnusedProperties: (enabled: boolean) => void

  // Sidebar refactor settings
  useRefactoredSidebars: boolean
  setUseRefactoredSidebars: (enabled: boolean) => void
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

      // Auto-expand settings
      autoExpandOnSelection: false,
      setAutoExpandOnSelection: (enabled) =>
        set((state) => ({ ...state, autoExpandOnSelection: enabled })),

      // Properties settings
      showUnusedProperties: false,
      setShowUnusedProperties: (enabled) =>
        set((state) => ({ ...state, showUnusedProperties: enabled })),

      // Sidebar refactor settings
      useRefactoredSidebars: false,
      setUseRefactoredSidebars: (enabled) =>
        set((state) => ({ ...state, useRefactoredSidebars: enabled })),
    }),
    {
      name: "editor-config",
      partialize: (state) => ({
        wireframeMode: state.wireframeMode,
        showPanels: state.showPanels,
        autoScrollToSelection: state.autoScrollToSelection,
        autoExpandOnSelection: state.autoExpandOnSelection,
        showUnusedProperties: state.showUnusedProperties,
        useRefactoredSidebars: state.useRefactoredSidebars,
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
    autoExpandOnSelection,
    setAutoExpandOnSelection,
    showUnusedProperties,
    setShowUnusedProperties,
    useRefactoredSidebars,
    setUseRefactoredSidebars,
  } = useStore(
    useShallow((state) => ({
      wireframeMode: state.wireframeMode,
      toggleWireframeMode: state.toggleWireframeMode,
      showPanels: state.showPanels,
      setShowPanels: state.setShowPanels,
      autoScrollToSelection: state.autoScrollToSelection,
      setAutoScrollToSelection: state.setAutoScrollToSelection,
      autoExpandOnSelection: state.autoExpandOnSelection,
      setAutoExpandOnSelection: state.setAutoExpandOnSelection,
      showUnusedProperties: state.showUnusedProperties,
      setShowUnusedProperties: state.setShowUnusedProperties,
      useRefactoredSidebars: state.useRefactoredSidebars,
      setUseRefactoredSidebars: state.setUseRefactoredSidebars,
    })),
  )

  const togglePanels = useCallback(() => {
    setShowPanels(!showPanels)
  }, [setShowPanels, showPanels])

  const toggleAutoScrollToSelection = useCallback(() => {
    setAutoScrollToSelection(!autoScrollToSelection)
  }, [setAutoScrollToSelection, autoScrollToSelection])

  const toggleAutoExpandOnSelection = useCallback(() => {
    setAutoExpandOnSelection(!autoExpandOnSelection)
  }, [setAutoExpandOnSelection, autoExpandOnSelection])

  const toggleShowUnusedProperties = useCallback(() => {
    setShowUnusedProperties(!showUnusedProperties)
  }, [setShowUnusedProperties, showUnusedProperties])

  const toggleRefactoredSidebars = useCallback(() => {
    setUseRefactoredSidebars(!useRefactoredSidebars)
  }, [setUseRefactoredSidebars, useRefactoredSidebars])

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

    // Auto-expand methods
    autoExpandOnSelection,
    setAutoExpandOnSelection,
    toggleAutoExpandOnSelection,

    // Properties methods
    showUnusedProperties,
    setShowUnusedProperties,
    toggleShowUnusedProperties,

    // Sidebar refactor methods
    useRefactoredSidebars,
    setUseRefactoredSidebars,
    toggleRefactoredSidebars,
  }
}
