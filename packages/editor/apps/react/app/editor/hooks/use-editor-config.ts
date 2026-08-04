import { useCallback } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import { SIDEBAR_INITIAL_WIDTH } from "@app/constants"

import type { Rect } from "@seldon/components/utils/resize"

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

  // Focus ring visibility (the overlay still tracks focus when off)
  showFocus: boolean
  setShowFocus: (enabled: boolean) => void

  // Wireframe settings
  wireframeMode: "auto" | "on" | "off"
  toggleWireframeMode: (mode?: "on" | "off") => void

  // Component connectors: the branch around the selection, drawn as lines across
  // the isolation gallery and tinted on the matching objects sidebar rows. Kept
  // across entering and leaving isolation, and only applied while isolated.
  showConnectors: boolean
  setShowConnectors: (enabled: boolean) => void

  // Reference badge overlay, drawing referenced nodes out to their consumers
  showRefBadges: boolean
  setShowRefBadges: (enabled: boolean) => void

  // Token badge overlay, one group per toggle, drawing the selection's property
  // tokens out to a gutter column opposite the reference badges.
  showLayoutBadges: boolean
  setShowLayoutBadges: (enabled: boolean) => void
  showSpaceBadges: boolean
  setShowSpaceBadges: (enabled: boolean) => void
  showDimensionBadges: boolean
  setShowDimensionBadges: (enabled: boolean) => void
  showAppearanceBadges: boolean
  setShowAppearanceBadges: (enabled: boolean) => void
  showTypographyBadges: boolean
  setShowTypographyBadges: (enabled: boolean) => void
  showEffectsBadges: boolean
  setShowEffectsBadges: (enabled: boolean) => void

  // Panel settings
  showPanels: boolean
  setShowPanels: (showPanels: boolean) => void

  // Docked sidebar widths in pixels, persisted so each opens at the width the
  // user last dragged it to. Clamped by the pane's own min and max.
  objectsSidebarWidth: number
  setObjectsSidebarWidth: (width: number) => void
  propertiesSidebarWidth: number
  setPropertiesSidebarWidth: (width: number) => void

  // Properties panel: floating (detached palette) vs docked (right-edge pane).
  // Each mode has its own shown flag, so "Show Properties" hides and reopens the
  // properties in whichever mode they are in without detaching or re-docking.
  propertiesFloating: boolean
  setPropertiesFloating: (enabled: boolean) => void
  propertiesFloatingOpen: boolean
  setPropertiesFloatingOpen: (enabled: boolean) => void
  propertiesDockedOpen: boolean
  setPropertiesDockedOpen: (enabled: boolean) => void

  // Persisted position and size of the floating palettes, so each reopens where
  // the user last left it, session to session. Null until the user moves or
  // resizes the palette, where it falls back to its default opening rect.
  propertiesPanelRect: Rect | null
  setPropertiesPanelRect: (rect: Rect) => void
  hariPanelRect: Rect | null
  setHariPanelRect: (rect: Rect) => void

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

  // Isolation mode: freezes the sidebar and canvas to one board plus the
  // components it uses. Sticky until disabled; deselection does not exit it.
  // `isolatedVariantRootId` is the variant captured on enable, so the anchored
  // board keeps showing that one variant regardless of later selection.
  isolatedView: boolean
  isolatedBoardKey: string | null
  isolatedVariantRootId: string | null
  enableIsolation: (boardKey: string, variantRootId: string | null) => void
  disableIsolation: () => void

  // Direct select mode: every canvas click and hover targets the exact node
  // under the cursor, as if cmd/ctrl were always held. This is the pre-drill
  // selection behavior. Off by default.
  directSelect: boolean
  setDirectSelect: (enabled: boolean) => void

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
      setShowSelection: (enabled) => set((state) => ({ ...state, showSelection: enabled })),

      // Focus ring visibility
      showFocus: true,
      setShowFocus: (enabled) => set((state) => ({ ...state, showFocus: enabled })),

      // Wireframe settings
      wireframeMode: "auto",
      toggleWireframeMode: (mode) =>
        set((state) => {
          const newMode =
            mode ?? (state.wireframeMode === "auto" || state.wireframeMode === "off" ? "on" : "off")

          return { ...state, wireframeMode: newMode }
        }),

      // Component connectors (off by default)
      showConnectors: false,
      setShowConnectors: (enabled) => set((state) => ({ ...state, showConnectors: enabled })),

      // Ref connector overlay. Left out of `partialize` on purpose: the bindings
      // it draws are read from a linked folder during a gesture and are not
      // persisted, so restoring this on load would show an empty overlay.
      showRefBadges: false,
      setShowRefBadges: (enabled) => set((state) => ({ ...state, showRefBadges: enabled })),

      // Token badge overlay groups (off by default; persisted since tokens read
      // from the workspace, not a linked folder)
      showLayoutBadges: false,
      setShowLayoutBadges: (enabled) => set((state) => ({ ...state, showLayoutBadges: enabled })),
      showSpaceBadges: false,
      setShowSpaceBadges: (enabled) => set((state) => ({ ...state, showSpaceBadges: enabled })),
      showDimensionBadges: false,
      setShowDimensionBadges: (enabled) =>
        set((state) => ({ ...state, showDimensionBadges: enabled })),
      showAppearanceBadges: false,
      setShowAppearanceBadges: (enabled) =>
        set((state) => ({ ...state, showAppearanceBadges: enabled })),
      showTypographyBadges: false,
      setShowTypographyBadges: (enabled) =>
        set((state) => ({ ...state, showTypographyBadges: enabled })),
      showEffectsBadges: false,
      setShowEffectsBadges: (enabled) => set((state) => ({ ...state, showEffectsBadges: enabled })),

      // Panel settings
      showPanels: true,
      setShowPanels: (showPanels) => set((state) => ({ ...state, showPanels })),

      // Docked sidebar widths (default to the shared opening width until dragged)
      objectsSidebarWidth: SIDEBAR_INITIAL_WIDTH,
      setObjectsSidebarWidth: (width) =>
        set((state) => ({ ...state, objectsSidebarWidth: width })),
      propertiesSidebarWidth: SIDEBAR_INITIAL_WIDTH,
      setPropertiesSidebarWidth: (width) =>
        set((state) => ({ ...state, propertiesSidebarWidth: width })),

      // Properties panel float settings (docked by default; palette shown once
      // it is detached, until the user closes it)
      propertiesFloating: false,
      setPropertiesFloating: (enabled) =>
        set((state) => ({ ...state, propertiesFloating: enabled })),
      propertiesFloatingOpen: true,
      setPropertiesFloatingOpen: (enabled) =>
        set((state) => ({ ...state, propertiesFloatingOpen: enabled })),
      propertiesDockedOpen: true,
      setPropertiesDockedOpen: (enabled) =>
        set((state) => ({ ...state, propertiesDockedOpen: enabled })),

      // Persisted floating palette geometry (null until first moved/resized)
      propertiesPanelRect: null,
      setPropertiesPanelRect: (rect) =>
        set((state) => ({ ...state, propertiesPanelRect: rect })),
      hariPanelRect: null,
      setHariPanelRect: (rect) => set((state) => ({ ...state, hariPanelRect: rect })),

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
      setShowUnusedFonts: (enabled) => set((state) => ({ ...state, showUnusedFonts: enabled })),

      // Icon set settings
      showUnusedIcons: false,
      setShowUnusedIcons: (enabled) => set((state) => ({ ...state, showUnusedIcons: enabled })),

      // Playground section visibility (off until enabled from the Dev menu)
      showPlayground: false,
      setShowPlayground: (enabled) => set((state) => ({ ...state, showPlayground: enabled })),

      // Isolation mode (off by default; the anchored board and its selected
      // variant are captured on enable)
      isolatedView: false,
      isolatedBoardKey: null,
      isolatedVariantRootId: null,
      enableIsolation: (boardKey, variantRootId) =>
        set((state) => ({
          ...state,
          isolatedView: true,
          isolatedBoardKey: boardKey,
          isolatedVariantRootId: variantRootId,
        })),
      disableIsolation: () =>
        set((state) => ({
          ...state,
          isolatedView: false,
          isolatedBoardKey: null,
          isolatedVariantRootId: null,
        })),

      // Direct select mode (off by default)
      directSelect: false,
      setDirectSelect: (enabled) => set((state) => ({ ...state, directSelect: enabled })),

      // Objects sidebar code names (off by default)
      showCodeNames: false,
      setShowCodeNames: (enabled) => set((state) => ({ ...state, showCodeNames: enabled })),

      // Objects sidebar content view (components by default)
      objectsView: "components",
      setObjectsView: (view) => set((state) => ({ ...state, objectsView: view })),

      // Sidebar refactor settings
      useRefactoredSidebars: false,
      setUseRefactoredSidebars: (enabled) =>
        set((state) => ({ ...state, useRefactoredSidebars: enabled })),

      // Editor chrome theme
      chromeTheme: "seldon",
      setChromeTheme: (slug) => set((state) => ({ ...state, chromeTheme: slug })),

      // Editor interface mode (defaults to light; persisted across sessions)
      interfaceMode: "light",
      setInterfaceMode: (mode) => set((state) => ({ ...state, interfaceMode: mode })),
    }),
    {
      name: "editor-config",
      partialize: (state) => ({
        showSelection: state.showSelection,
        showFocus: state.showFocus,
        wireframeMode: state.wireframeMode,
        showConnectors: state.showConnectors,
        showPanels: state.showPanels,
        objectsSidebarWidth: state.objectsSidebarWidth,
        propertiesSidebarWidth: state.propertiesSidebarWidth,
        propertiesFloating: state.propertiesFloating,
        propertiesFloatingOpen: state.propertiesFloatingOpen,
        propertiesDockedOpen: state.propertiesDockedOpen,
        propertiesPanelRect: state.propertiesPanelRect,
        hariPanelRect: state.hariPanelRect,
        autoScrollToSelection: state.autoScrollToSelection,
        autoExpandOnSelection: state.autoExpandOnSelection,
        showLayoutBadges: state.showLayoutBadges,
        showSpaceBadges: state.showSpaceBadges,
        showDimensionBadges: state.showDimensionBadges,
        showAppearanceBadges: state.showAppearanceBadges,
        showTypographyBadges: state.showTypographyBadges,
        showEffectsBadges: state.showEffectsBadges,
        showUnusedProperties: state.showUnusedProperties,
        showUnusedFonts: state.showUnusedFonts,
        showUnusedIcons: state.showUnusedIcons,
        showPlayground: state.showPlayground,
        showCodeNames: state.showCodeNames,
        objectsView: state.objectsView,
        isolatedView: state.isolatedView,
        isolatedBoardKey: state.isolatedBoardKey,
        isolatedVariantRootId: state.isolatedVariantRootId,
        directSelect: state.directSelect,
        useRefactoredSidebars: state.useRefactoredSidebars,
        chromeTheme: state.chromeTheme,
        interfaceMode: state.interfaceMode,
      }),
    },
  ),
)

/**
 * Subscribes to just the properties-floating flag.
 *
 * `useEditorConfig` reads the whole config and rebuilds every action, so calling it in a
 * per-item hook that re-renders each frame, such as a badge tracking its node during a pan,
 * costs far more than the one boolean needs. This reads that field alone and re-renders only
 * when it flips.
 */
export function usePropertiesFloating(): boolean {
  return useStore((state) => state.propertiesFloating)
}

/**
 * Subscribes to just the chrome theme slug.
 *
 * For the same reason as `usePropertiesFloating`: a surface that re-renders each frame, such
 * as a badge card following its badge through a pan, needs this one field and not the whole
 * config with every action rebuilt.
 */
export function useChromeTheme(): string {
  return useStore((state) => state.chromeTheme)
}

/** Subscribes to just the stored interface mode, for the same per-frame reason. */
export function useInterfaceMode(): InterfaceMode {
  return useStore((state) => state.interfaceMode)
}

export function useEditorConfig() {
  const {
    showSelection,
    setShowSelection,
    showFocus,
    setShowFocus,
    wireframeMode,
    toggleWireframeMode,
    showConnectors,
    setShowConnectors,
    showRefBadges,
    setShowRefBadges,
    showLayoutBadges,
    setShowLayoutBadges,
    showSpaceBadges,
    setShowSpaceBadges,
    showDimensionBadges,
    setShowDimensionBadges,
    showAppearanceBadges,
    setShowAppearanceBadges,
    showTypographyBadges,
    setShowTypographyBadges,
    showEffectsBadges,
    setShowEffectsBadges,
    showPanels,
    setShowPanels,
    objectsSidebarWidth,
    setObjectsSidebarWidth,
    propertiesSidebarWidth,
    setPropertiesSidebarWidth,
    propertiesFloating,
    setPropertiesFloating,
    propertiesFloatingOpen,
    setPropertiesFloatingOpen,
    propertiesDockedOpen,
    setPropertiesDockedOpen,
    propertiesPanelRect,
    setPropertiesPanelRect,
    hariPanelRect,
    setHariPanelRect,
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
    isolatedView,
    isolatedBoardKey,
    isolatedVariantRootId,
    enableIsolation,
    disableIsolation,
    directSelect,
    setDirectSelect,
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
      showFocus: state.showFocus,
      setShowFocus: state.setShowFocus,
      wireframeMode: state.wireframeMode,
      toggleWireframeMode: state.toggleWireframeMode,
      showConnectors: state.showConnectors,
      setShowConnectors: state.setShowConnectors,
      showRefBadges: state.showRefBadges,
      setShowRefBadges: state.setShowRefBadges,
      showLayoutBadges: state.showLayoutBadges,
      setShowLayoutBadges: state.setShowLayoutBadges,
      showSpaceBadges: state.showSpaceBadges,
      setShowSpaceBadges: state.setShowSpaceBadges,
      showDimensionBadges: state.showDimensionBadges,
      setShowDimensionBadges: state.setShowDimensionBadges,
      showAppearanceBadges: state.showAppearanceBadges,
      setShowAppearanceBadges: state.setShowAppearanceBadges,
      showTypographyBadges: state.showTypographyBadges,
      setShowTypographyBadges: state.setShowTypographyBadges,
      showEffectsBadges: state.showEffectsBadges,
      setShowEffectsBadges: state.setShowEffectsBadges,
      showPanels: state.showPanels,
      setShowPanels: state.setShowPanels,
      objectsSidebarWidth: state.objectsSidebarWidth,
      setObjectsSidebarWidth: state.setObjectsSidebarWidth,
      propertiesSidebarWidth: state.propertiesSidebarWidth,
      setPropertiesSidebarWidth: state.setPropertiesSidebarWidth,
      propertiesFloating: state.propertiesFloating,
      setPropertiesFloating: state.setPropertiesFloating,
      propertiesFloatingOpen: state.propertiesFloatingOpen,
      setPropertiesFloatingOpen: state.setPropertiesFloatingOpen,
      propertiesDockedOpen: state.propertiesDockedOpen,
      setPropertiesDockedOpen: state.setPropertiesDockedOpen,
      propertiesPanelRect: state.propertiesPanelRect,
      setPropertiesPanelRect: state.setPropertiesPanelRect,
      hariPanelRect: state.hariPanelRect,
      setHariPanelRect: state.setHariPanelRect,
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
      isolatedView: state.isolatedView,
      isolatedBoardKey: state.isolatedBoardKey,
      isolatedVariantRootId: state.isolatedVariantRootId,
      enableIsolation: state.enableIsolation,
      disableIsolation: state.disableIsolation,
      directSelect: state.directSelect,
      setDirectSelect: state.setDirectSelect,
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

  // Detach the Properties panel into a floating palette and show it. Docking is
  // the plain setter with `false`.
  const floatProperties = useCallback(() => {
    setPropertiesFloating(true)
    setPropertiesFloatingOpen(true)
  }, [setPropertiesFloating, setPropertiesFloatingOpen])

  // Hide or reveal the properties in whichever mode they are in. It never detaches
  // or re-docks: floating toggles the palette, docked toggles the right-edge pane.
  const showProperties = useCallback(() => {
    if (propertiesFloating) {
      setPropertiesFloatingOpen(!propertiesFloatingOpen)

      return
    }

    setPropertiesDockedOpen(!propertiesDockedOpen)
  }, [
    propertiesFloating,
    propertiesFloatingOpen,
    setPropertiesFloatingOpen,
    propertiesDockedOpen,
    setPropertiesDockedOpen,
  ])

  const toggleShowSelection = useCallback(() => {
    setShowSelection(!showSelection)
  }, [setShowSelection, showSelection])

  const toggleShowFocus = useCallback(() => {
    setShowFocus(!showFocus)
  }, [setShowFocus, showFocus])

  const toggleShowConnectors = useCallback(() => {
    setShowConnectors(!showConnectors)
  }, [setShowConnectors, showConnectors])

  const toggleLayoutBadges = useCallback(() => {
    setShowLayoutBadges(!showLayoutBadges)
  }, [setShowLayoutBadges, showLayoutBadges])

  const toggleSpaceBadges = useCallback(() => {
    setShowSpaceBadges(!showSpaceBadges)
  }, [setShowSpaceBadges, showSpaceBadges])

  const toggleDimensionBadges = useCallback(() => {
    setShowDimensionBadges(!showDimensionBadges)
  }, [setShowDimensionBadges, showDimensionBadges])

  const toggleAppearanceBadges = useCallback(() => {
    setShowAppearanceBadges(!showAppearanceBadges)
  }, [setShowAppearanceBadges, showAppearanceBadges])

  const toggleTypographyBadges = useCallback(() => {
    setShowTypographyBadges(!showTypographyBadges)
  }, [setShowTypographyBadges, showTypographyBadges])

  const toggleEffectsBadges = useCallback(() => {
    setShowEffectsBadges(!showEffectsBadges)
  }, [setShowEffectsBadges, showEffectsBadges])

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

  const toggleDirectSelect = useCallback(() => {
    setDirectSelect(!directSelect)
  }, [setDirectSelect, directSelect])

  return {
    showSelection,
    setShowSelection,
    toggleShowSelection,

    // Focus ring methods
    showFocus,
    setShowFocus,
    toggleShowFocus,

    // Wireframe methods
    wireframeMode,
    toggleWireframeMode,

    // Component connector methods
    showConnectors,
    setShowConnectors,
    toggleShowConnectors,

    // Reference badge overlay. Toggled through `useRefBadges`, which reads the
    // linked folder on the same gesture that turns it on.
    showRefBadges,
    setShowRefBadges,

    // Token badge overlay groups
    showLayoutBadges,
    setShowLayoutBadges,
    toggleLayoutBadges,
    showSpaceBadges,
    setShowSpaceBadges,
    toggleSpaceBadges,
    showDimensionBadges,
    setShowDimensionBadges,
    toggleDimensionBadges,
    showAppearanceBadges,
    setShowAppearanceBadges,
    toggleAppearanceBadges,
    showTypographyBadges,
    setShowTypographyBadges,
    toggleTypographyBadges,
    showEffectsBadges,
    setShowEffectsBadges,
    toggleEffectsBadges,

    // Panel methods
    showPanels,
    setShowPanels,
    togglePanels,

    // Docked sidebar widths
    objectsSidebarWidth,
    setObjectsSidebarWidth,
    propertiesSidebarWidth,
    setPropertiesSidebarWidth,

    // Properties panel float methods
    propertiesFloating,
    setPropertiesFloating,
    propertiesFloatingOpen,
    setPropertiesFloatingOpen,
    propertiesDockedOpen,
    setPropertiesDockedOpen,
    propertiesPanelRect,
    setPropertiesPanelRect,
    hariPanelRect,
    setHariPanelRect,
    floatProperties,
    showProperties,

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

    // Isolation mode
    isolatedView,
    isolatedBoardKey,
    isolatedVariantRootId,
    enableIsolation,
    disableIsolation,

    // Direct select mode
    directSelect,
    setDirectSelect,
    toggleDirectSelect,

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
