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

/**
 * Editor interface light/dark mode. `"system"` follows the OS appearance,
 * resolving to light or dark at runtime. Applies to the editor chrome only; it
 * is never written to the workspace and never affects the canvas.
 */
export type InterfaceMode = "system" | "light" | "dark"

/**
 * Objects sidebar content view. `"components"` lists Playground, Screens,
 * Modules, Parts, Elements, and Primitives; `"resources"` lists Themes, Font
 * Collections, and Icon Sets. Toggled from the sidebar header, defaulting to
 * components.
 */
export type ObjectsView = "components" | "resources"

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

  // Playground section visibility in the objects sidebar
  showPlayground: boolean
  setShowPlayground: (enabled: boolean) => void

  // Objects sidebar: show export component (code) names instead of labels
  showCodeNames: boolean
  setShowCodeNames: (enabled: boolean) => void

  // Objects sidebar: components vs resources content view
  objectsView: ObjectsView
  setObjectsView: (view: ObjectsView) => void

  // Sidebar refactor settings
  useRefactoredSidebars: boolean
  setUseRefactoredSidebars: (enabled: boolean) => void

  // Editor chrome theme (slug of an exported theme stylesheet). This re-themes
  // the editor interface only; it is never written to the workspace and never
  // affects the canvas.
  chromeTheme: string
  setChromeTheme: (slug: string) => void

  // Editor interface light/dark mode (chrome only). `"system"` follows the OS.
  interfaceMode: InterfaceMode
  setInterfaceMode: (mode: InterfaceMode) => void
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

      // Playground section visibility (off until enabled from the Dev menu)
      showPlayground: false,
      setShowPlayground: (enabled) =>
        set((state) => ({ ...state, showPlayground: enabled })),

      // Objects sidebar code names (off by default)
      showCodeNames: false,
      setShowCodeNames: (enabled) =>
        set((state) => ({ ...state, showCodeNames: enabled })),

      // Objects sidebar content view (components by default)
      objectsView: "components",
      setObjectsView: (view) =>
        set((state) => ({ ...state, objectsView: view })),

      // Sidebar refactor settings
      useRefactoredSidebars: false,
      setUseRefactoredSidebars: (enabled) =>
        set((state) => ({ ...state, useRefactoredSidebars: enabled })),

      // Editor chrome theme
      chromeTheme: "seldon",
      setChromeTheme: (slug) =>
        set((state) => ({ ...state, chromeTheme: slug })),

      // Editor interface mode (defaults to light; persisted across sessions)
      interfaceMode: "light",
      setInterfaceMode: (mode) =>
        set((state) => ({ ...state, interfaceMode: mode })),
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
        showPlayground: state.showPlayground,
        showCodeNames: state.showCodeNames,
        objectsView: state.objectsView,
        useRefactoredSidebars: state.useRefactoredSidebars,
        chromeTheme: state.chromeTheme,
        interfaceMode: state.interfaceMode,
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
    showPlayground,
    setShowPlayground,
    showCodeNames,
    setShowCodeNames,
    objectsView,
    setObjectsView,
    useRefactoredSidebars,
    setUseRefactoredSidebars,
    chromeTheme,
    setChromeTheme,
    interfaceMode,
    setInterfaceMode,
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
      showPlayground: state.showPlayground,
      setShowPlayground: state.setShowPlayground,
      showCodeNames: state.showCodeNames,
      setShowCodeNames: state.setShowCodeNames,
      objectsView: state.objectsView,
      setObjectsView: state.setObjectsView,
      useRefactoredSidebars: state.useRefactoredSidebars,
      setUseRefactoredSidebars: state.setUseRefactoredSidebars,
      chromeTheme: state.chromeTheme,
      setChromeTheme: state.setChromeTheme,
      interfaceMode: state.interfaceMode,
      setInterfaceMode: state.setInterfaceMode,
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

  const toggleShowPlayground = useCallback(() => {
    setShowPlayground(!showPlayground)
  }, [setShowPlayground, showPlayground])

  const toggleShowCodeNames = useCallback(() => {
    setShowCodeNames(!showCodeNames)
  }, [setShowCodeNames, showCodeNames])

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

    // Playground section methods
    showPlayground,
    setShowPlayground,
    toggleShowPlayground,

    // Objects sidebar code names methods
    showCodeNames,
    setShowCodeNames,
    toggleShowCodeNames,

    // Objects sidebar content view
    objectsView,
    setObjectsView,

    // Sidebar refactor methods
    useRefactoredSidebars,
    setUseRefactoredSidebars,
    toggleRefactoredSidebars,

    // Editor chrome theme
    chromeTheme,
    setChromeTheme,

    // Editor interface mode
    interfaceMode,
    setInterfaceMode,
  }
}
