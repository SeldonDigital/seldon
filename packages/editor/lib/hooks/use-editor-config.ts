import { useCallback } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

/**
 * Component-relationship highlight shown in the objects sidebar. `"selection"`
 * is the normal state with no relationship overlay. `"leaves"` highlights what
 * inherits from the selection, `"branch"` adds its source lineage, and `"tree"`
 * highlights the whole related group. Behaves as a radio in the View menu.
 */
export type ComponentHighlightMode = "selection" | "leaves" | "branch" | "tree"

interface EditorConfigState {
  // Canvas selection and hover overlay boxes in select mode
  showSelection: boolean
  setShowSelection: (enabled: boolean) => void

  // Component-relationship highlight mode (radio with normal selection)
  componentHighlightMode: ComponentHighlightMode
  setComponentHighlightMode: (mode: ComponentHighlightMode) => void

  // Focus ring visibility (the overlay still tracks focus when off)
  showFocus: boolean
  setShowFocus: (enabled: boolean) => void

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

  // Font collection settings
  showUnusedFonts: boolean
  setShowUnusedFonts: (enabled: boolean) => void

  // Icon set settings
  showUnusedIcons: boolean
  setShowUnusedIcons: (enabled: boolean) => void

  // Sidebar refactor settings
  useRefactoredSidebars: boolean
  setUseRefactoredSidebars: (enabled: boolean) => void
}

const useStore = create<EditorConfigState>()(
  persist(
    (set) => ({
      showSelection: true,
      setShowSelection: (enabled) =>
        set((state) => ({ ...state, showSelection: enabled })),

      componentHighlightMode: "selection",
      setComponentHighlightMode: (mode) =>
        set((state) => ({ ...state, componentHighlightMode: mode })),

      // Focus ring visibility
      showFocus: true,
      setShowFocus: (enabled) =>
        set((state) => ({ ...state, showFocus: enabled })),

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

      // Font collection settings
      showUnusedFonts: false,
      setShowUnusedFonts: (enabled) =>
        set((state) => ({ ...state, showUnusedFonts: enabled })),

      // Icon set settings
      showUnusedIcons: false,
      setShowUnusedIcons: (enabled) =>
        set((state) => ({ ...state, showUnusedIcons: enabled })),

      // Sidebar refactor settings
      useRefactoredSidebars: false,
      setUseRefactoredSidebars: (enabled) =>
        set((state) => ({ ...state, useRefactoredSidebars: enabled })),
    }),
    {
      name: "editor-config",
      partialize: (state) => ({
        showSelection: state.showSelection,
        componentHighlightMode: state.componentHighlightMode,
        showFocus: state.showFocus,
        wireframeMode: state.wireframeMode,
        showPanels: state.showPanels,
        autoScrollToSelection: state.autoScrollToSelection,
        autoExpandOnSelection: state.autoExpandOnSelection,
        showUnusedProperties: state.showUnusedProperties,
        showUnusedFonts: state.showUnusedFonts,
        showUnusedIcons: state.showUnusedIcons,
        useRefactoredSidebars: state.useRefactoredSidebars,
      }),
    },
  ),
)

export function useEditorConfig() {
  const {
    showSelection,
    setShowSelection,
    componentHighlightMode,
    setComponentHighlightMode,
    showFocus,
    setShowFocus,
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
    showUnusedFonts,
    setShowUnusedFonts,
    showUnusedIcons,
    setShowUnusedIcons,
    useRefactoredSidebars,
    setUseRefactoredSidebars,
  } = useStore(
    useShallow((state) => ({
      showSelection: state.showSelection,
      setShowSelection: state.setShowSelection,
      componentHighlightMode: state.componentHighlightMode,
      setComponentHighlightMode: state.setComponentHighlightMode,
      showFocus: state.showFocus,
      setShowFocus: state.setShowFocus,
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
      showUnusedFonts: state.showUnusedFonts,
      setShowUnusedFonts: state.setShowUnusedFonts,
      showUnusedIcons: state.showUnusedIcons,
      setShowUnusedIcons: state.setShowUnusedIcons,
      useRefactoredSidebars: state.useRefactoredSidebars,
      setUseRefactoredSidebars: state.setUseRefactoredSidebars,
    })),
  )

  const togglePanels = useCallback(() => {
    setShowPanels(!showPanels)
  }, [setShowPanels, showPanels])

  const toggleShowSelection = useCallback(() => {
    setShowSelection(!showSelection)
  }, [setShowSelection, showSelection])

  const toggleShowFocus = useCallback(() => {
    setShowFocus(!showFocus)
  }, [setShowFocus, showFocus])

  const toggleAutoScrollToSelection = useCallback(() => {
    setAutoScrollToSelection(!autoScrollToSelection)
  }, [setAutoScrollToSelection, autoScrollToSelection])

  const toggleAutoExpandOnSelection = useCallback(() => {
    setAutoExpandOnSelection(!autoExpandOnSelection)
  }, [setAutoExpandOnSelection, autoExpandOnSelection])

  const toggleShowUnusedProperties = useCallback(() => {
    setShowUnusedProperties(!showUnusedProperties)
  }, [setShowUnusedProperties, showUnusedProperties])

  const toggleShowUnusedFonts = useCallback(() => {
    setShowUnusedFonts(!showUnusedFonts)
  }, [setShowUnusedFonts, showUnusedFonts])

  const toggleShowUnusedIcons = useCallback(() => {
    setShowUnusedIcons(!showUnusedIcons)
  }, [setShowUnusedIcons, showUnusedIcons])

  const toggleRefactoredSidebars = useCallback(() => {
    setUseRefactoredSidebars(!useRefactoredSidebars)
  }, [setUseRefactoredSidebars, useRefactoredSidebars])

  return {
    showSelection,
    setShowSelection,
    toggleShowSelection,

    // Component-relationship highlight (radio)
    componentHighlightMode,
    setComponentHighlightMode,

    // Focus ring methods
    showFocus,
    setShowFocus,
    toggleShowFocus,

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

    // Font collection methods
    showUnusedFonts,
    setShowUnusedFonts,
    toggleShowUnusedFonts,

    // Icon set methods
    showUnusedIcons,
    setShowUnusedIcons,
    toggleShowUnusedIcons,

    // Sidebar refactor methods
    useRefactoredSidebars,
    setUseRefactoredSidebars,
    toggleRefactoredSidebars,
  }
}
