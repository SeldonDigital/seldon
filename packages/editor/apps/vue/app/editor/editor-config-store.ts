import { defineStore } from "pinia"
import { ref, watch } from "vue"

/** Editor interface light/dark mode (chrome only). "system" follows the OS. */
export type InterfaceMode = "system" | "light" | "dark"

/** Objects sidebar content view. */
export type ObjectsView = "components" | "resources"

export type WireframeMode = "auto" | "on" | "off"

/** Absolute rect of a floating palette in viewport coordinates. */
export interface PanelRect {
  x: number
  y: number
  width: number
  height: number
}

const STORAGE_KEY = "editor-config"

/** Sidebar width bounds, matching the React Allotment panes. */
export const SIDEBAR_MIN_WIDTH = 280
export const SIDEBAR_MAX_WIDTH = 600
export const SIDEBAR_INITIAL_WIDTH = 360

function clampSidebarWidth(width: number): number {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, Math.round(width)))
}

type PersistedConfig = {
  showSelection: boolean
  showFocus: boolean
  wireframeMode: WireframeMode
  showConnectors: boolean
  showPanels: boolean
  autoScrollToSelection: boolean
  autoExpandOnSelection: boolean
  showUnusedProperties: boolean
  showUnusedFonts: boolean
  showUnusedIcons: boolean
  showPlayground: boolean
  showCodeNames: boolean
  objectsView: ObjectsView
  isolatedView: boolean
  isolatedBoardKey: string | null
  isolatedVariantRootId: string | null
  directSelect: boolean
  objectsWidth: number
  propertiesWidth: number
  useRefactoredSidebars: boolean
  chromeTheme: string
  interfaceMode: InterfaceMode
  showLayoutBadges: boolean
  showSpaceBadges: boolean
  showDimensionBadges: boolean
  showAppearanceBadges: boolean
  showTypographyBadges: boolean
  showEffectsBadges: boolean
  propertiesFloating: boolean
  propertiesFloatingOpen: boolean
  propertiesDockedOpen: boolean
  propertiesPanelRect: PanelRect | null
  hariPanelRect: PanelRect | null
}

function loadPersisted(): Partial<PersistedConfig> {
  if (typeof localStorage === "undefined") return {}

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw ? (JSON.parse(raw) as Partial<PersistedConfig>) : {}
  } catch {
    return {}
  }
}

/**
 * Editor chrome configuration: canvas overlay toggles, sidebar view options,
 * wireframe mode, chrome theme, and interface mode. Chrome-only; never written
 * to the workspace or the canvas. Mirrors the React `use-editor-config` store,
 * including persistence of the same field subset to localStorage.
 */
export const useEditorConfigStore = defineStore("editor-config", () => {
  const persisted = loadPersisted()

  const showSelection = ref(persisted.showSelection ?? true)
  const showFocus = ref(persisted.showFocus ?? true)
  const wireframeMode = ref<WireframeMode>(persisted.wireframeMode ?? "auto")
  const showConnectors = ref(persisted.showConnectors ?? false)
  const showPanels = ref(persisted.showPanels ?? true)
  const autoScrollToSelection = ref(persisted.autoScrollToSelection ?? true)
  const autoExpandOnSelection = ref(persisted.autoExpandOnSelection ?? false)
  const showUnusedProperties = ref(persisted.showUnusedProperties ?? false)
  const showUnusedFonts = ref(persisted.showUnusedFonts ?? false)
  const showUnusedIcons = ref(persisted.showUnusedIcons ?? false)
  const showPlayground = ref(persisted.showPlayground ?? false)

  // Reference badge overlay. Left out of the persisted snapshot on purpose: the
  // bindings it draws are read from a linked folder during a gesture and are not
  // persisted, so restoring this on load would show an empty overlay.
  const showRefBadges = ref(false)
  const showCodeNames = ref(persisted.showCodeNames ?? false)
  const objectsView = ref<ObjectsView>(persisted.objectsView ?? "components")
  const isolatedView = ref(persisted.isolatedView ?? false)
  const isolatedBoardKey = ref<string | null>(persisted.isolatedBoardKey ?? null)
  const isolatedVariantRootId = ref<string | null>(persisted.isolatedVariantRootId ?? null)
  const directSelect = ref(persisted.directSelect ?? false)
  const objectsWidth = ref(clampSidebarWidth(persisted.objectsWidth ?? SIDEBAR_INITIAL_WIDTH))
  const propertiesWidth = ref(clampSidebarWidth(persisted.propertiesWidth ?? SIDEBAR_INITIAL_WIDTH))
  const useRefactoredSidebars = ref(persisted.useRefactoredSidebars ?? false)
  const chromeTheme = ref(persisted.chromeTheme ?? "seldon")
  const interfaceMode = ref<InterfaceMode>(persisted.interfaceMode ?? "light")

  // Token badge overlay groups, one per toggle, drawing the selection's property
  // tokens out to a gutter column opposite the reference badges. Off by default;
  // persisted since tokens read from the workspace, not a linked folder.
  const showLayoutBadges = ref(persisted.showLayoutBadges ?? false)
  const showSpaceBadges = ref(persisted.showSpaceBadges ?? false)
  const showDimensionBadges = ref(persisted.showDimensionBadges ?? false)
  const showAppearanceBadges = ref(persisted.showAppearanceBadges ?? false)
  const showTypographyBadges = ref(persisted.showTypographyBadges ?? false)
  const showEffectsBadges = ref(persisted.showEffectsBadges ?? false)

  // Properties panel: floating (detached palette) vs docked (right-edge pane).
  // Each mode has its own shown flag, so "Show Properties" hides and reopens the
  // properties in whichever mode they are in without detaching or re-docking.
  const propertiesFloating = ref(persisted.propertiesFloating ?? false)
  const propertiesFloatingOpen = ref(persisted.propertiesFloatingOpen ?? true)
  const propertiesDockedOpen = ref(persisted.propertiesDockedOpen ?? true)

  // Persisted position and size of the floating palettes, so each reopens where
  // the user last left it. Null until the user moves or resizes the palette.
  const propertiesPanelRect = ref<PanelRect | null>(persisted.propertiesPanelRect ?? null)
  const hariPanelRect = ref<PanelRect | null>(persisted.hariPanelRect ?? null)

  function toggleWireframeMode(mode?: "on" | "off"): void {
    wireframeMode.value =
      mode ?? (wireframeMode.value === "auto" || wireframeMode.value === "off" ? "on" : "off")
  }

  function togglePanels(): void {
    showPanels.value = !showPanels.value
  }

  function toggleShowSelection(): void {
    showSelection.value = !showSelection.value
  }

  function toggleShowFocus(): void {
    showFocus.value = !showFocus.value
  }

  function toggleShowConnectors(): void {
    showConnectors.value = !showConnectors.value
  }

  function toggleAutoExpandOnSelection(): void {
    autoExpandOnSelection.value = !autoExpandOnSelection.value
  }

  function toggleAutoScrollToSelection(): void {
    autoScrollToSelection.value = !autoScrollToSelection.value
  }

  function toggleShowCodeNames(): void {
    showCodeNames.value = !showCodeNames.value
  }

  function toggleShowUnusedProperties(): void {
    showUnusedProperties.value = !showUnusedProperties.value
  }

  function toggleShowUnusedFonts(): void {
    showUnusedFonts.value = !showUnusedFonts.value
  }

  function toggleShowUnusedIcons(): void {
    showUnusedIcons.value = !showUnusedIcons.value
  }

  function toggleShowPlayground(): void {
    showPlayground.value = !showPlayground.value
  }

  function setShowRefBadges(enabled: boolean): void {
    showRefBadges.value = enabled
  }

  function enableIsolation(boardKey: string, variantRootId: string | null): void {
    isolatedView.value = true
    isolatedBoardKey.value = boardKey
    isolatedVariantRootId.value = variantRootId
  }

  function disableIsolation(): void {
    isolatedView.value = false
    isolatedBoardKey.value = null
    isolatedVariantRootId.value = null
  }

  function toggleDirectSelect(): void {
    directSelect.value = !directSelect.value
  }

  function setObjectsView(view: ObjectsView): void {
    objectsView.value = view
  }

  function setObjectsWidth(width: number): void {
    objectsWidth.value = clampSidebarWidth(width)
  }

  function setPropertiesWidth(width: number): void {
    propertiesWidth.value = clampSidebarWidth(width)
  }

  function setChromeTheme(slug: string): void {
    chromeTheme.value = slug
  }

  function setInterfaceMode(mode: InterfaceMode): void {
    interfaceMode.value = mode
  }

  function toggleLayoutBadges(): void {
    showLayoutBadges.value = !showLayoutBadges.value
  }

  function toggleSpaceBadges(): void {
    showSpaceBadges.value = !showSpaceBadges.value
  }

  function toggleDimensionBadges(): void {
    showDimensionBadges.value = !showDimensionBadges.value
  }

  function toggleAppearanceBadges(): void {
    showAppearanceBadges.value = !showAppearanceBadges.value
  }

  function toggleTypographyBadges(): void {
    showTypographyBadges.value = !showTypographyBadges.value
  }

  function toggleEffectsBadges(): void {
    showEffectsBadges.value = !showEffectsBadges.value
  }

  function setPropertiesFloating(enabled: boolean): void {
    propertiesFloating.value = enabled
  }

  function setPropertiesFloatingOpen(enabled: boolean): void {
    propertiesFloatingOpen.value = enabled
  }

  function setPropertiesDockedOpen(enabled: boolean): void {
    propertiesDockedOpen.value = enabled
  }

  // Detach the Properties panel into a floating palette and show it. Docking is
  // the plain setter with false.
  function floatProperties(): void {
    propertiesFloating.value = true
    propertiesFloatingOpen.value = true
  }

  // Hide or reveal the properties in whichever mode they are in. It never
  // detaches or re-docks: floating toggles the palette, docked toggles the pane.
  function showProperties(): void {
    if (propertiesFloating.value) {
      propertiesFloatingOpen.value = !propertiesFloatingOpen.value

      return
    }

    propertiesDockedOpen.value = !propertiesDockedOpen.value
  }

  function setPropertiesPanelRect(rect: PanelRect): void {
    propertiesPanelRect.value = rect
  }

  function setHariPanelRect(rect: PanelRect): void {
    hariPanelRect.value = rect
  }

  watch(
    [
      showSelection,
      showFocus,
      wireframeMode,
      showConnectors,
      showPanels,
      autoScrollToSelection,
      autoExpandOnSelection,
      showUnusedProperties,
      showUnusedFonts,
      showUnusedIcons,
      showPlayground,
      showCodeNames,
      objectsView,
      isolatedView,
      isolatedBoardKey,
      isolatedVariantRootId,
      directSelect,
      objectsWidth,
      propertiesWidth,
      useRefactoredSidebars,
      chromeTheme,
      interfaceMode,
      showLayoutBadges,
      showSpaceBadges,
      showDimensionBadges,
      showAppearanceBadges,
      showTypographyBadges,
      showEffectsBadges,
      propertiesFloating,
      propertiesFloatingOpen,
      propertiesDockedOpen,
      propertiesPanelRect,
      hariPanelRect,
    ],
    () => {
      if (typeof localStorage === "undefined") return
      const snapshot: PersistedConfig = {
        showSelection: showSelection.value,
        showFocus: showFocus.value,
        wireframeMode: wireframeMode.value,
        showConnectors: showConnectors.value,
        showPanels: showPanels.value,
        autoScrollToSelection: autoScrollToSelection.value,
        autoExpandOnSelection: autoExpandOnSelection.value,
        showUnusedProperties: showUnusedProperties.value,
        showUnusedFonts: showUnusedFonts.value,
        showUnusedIcons: showUnusedIcons.value,
        showPlayground: showPlayground.value,
        showCodeNames: showCodeNames.value,
        objectsView: objectsView.value,
        isolatedView: isolatedView.value,
        isolatedBoardKey: isolatedBoardKey.value,
        isolatedVariantRootId: isolatedVariantRootId.value,
        directSelect: directSelect.value,
        objectsWidth: objectsWidth.value,
        propertiesWidth: propertiesWidth.value,
        useRefactoredSidebars: useRefactoredSidebars.value,
        chromeTheme: chromeTheme.value,
        interfaceMode: interfaceMode.value,
        showLayoutBadges: showLayoutBadges.value,
        showSpaceBadges: showSpaceBadges.value,
        showDimensionBadges: showDimensionBadges.value,
        showAppearanceBadges: showAppearanceBadges.value,
        showTypographyBadges: showTypographyBadges.value,
        showEffectsBadges: showEffectsBadges.value,
        propertiesFloating: propertiesFloating.value,
        propertiesFloatingOpen: propertiesFloatingOpen.value,
        propertiesDockedOpen: propertiesDockedOpen.value,
        propertiesPanelRect: propertiesPanelRect.value,
        hariPanelRect: hariPanelRect.value,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    },
    { deep: false },
  )

  return {
    showSelection,
    showFocus,
    wireframeMode,
    showConnectors,
    showPanels,
    autoScrollToSelection,
    autoExpandOnSelection,
    showUnusedProperties,
    showUnusedFonts,
    showUnusedIcons,
    showPlayground,
    showRefBadges,
    showCodeNames,
    objectsView,
    isolatedView,
    isolatedBoardKey,
    isolatedVariantRootId,
    directSelect,
    objectsWidth,
    propertiesWidth,
    useRefactoredSidebars,
    chromeTheme,
    interfaceMode,
    showLayoutBadges,
    showSpaceBadges,
    showDimensionBadges,
    showAppearanceBadges,
    showTypographyBadges,
    showEffectsBadges,
    propertiesFloating,
    propertiesFloatingOpen,
    propertiesDockedOpen,
    propertiesPanelRect,
    hariPanelRect,
    toggleLayoutBadges,
    toggleSpaceBadges,
    toggleDimensionBadges,
    toggleAppearanceBadges,
    toggleTypographyBadges,
    toggleEffectsBadges,
    setPropertiesFloating,
    setPropertiesFloatingOpen,
    setPropertiesDockedOpen,
    floatProperties,
    showProperties,
    setPropertiesPanelRect,
    setHariPanelRect,
    toggleWireframeMode,
    togglePanels,
    toggleShowSelection,
    toggleShowFocus,
    toggleShowConnectors,
    toggleAutoExpandOnSelection,
    toggleAutoScrollToSelection,
    toggleShowCodeNames,
    toggleShowUnusedProperties,
    toggleShowUnusedFonts,
    toggleShowUnusedIcons,
    toggleShowPlayground,
    setShowRefBadges,
    enableIsolation,
    disableIsolation,
    toggleDirectSelect,
    setObjectsView,
    setObjectsWidth,
    setPropertiesWidth,
    setChromeTheme,
    setInterfaceMode,
  }
})
