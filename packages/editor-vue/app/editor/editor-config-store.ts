import { defineStore } from "pinia"
import { ref, watch } from "vue"

/**
 * Component-relationship highlight shown in the objects sidebar. Behaves as a
 * radio in the View menu.
 */
export type ComponentHighlightMode = "selection" | "leaves" | "branch" | "tree"

/** Editor interface light/dark mode (chrome only). "system" follows the OS. */
export type InterfaceMode = "system" | "light" | "dark"

/** Objects sidebar content view. */
export type ObjectsView = "components" | "resources"

export type WireframeMode = "auto" | "on" | "off"

const STORAGE_KEY = "editor-config"

/** Objects sidebar width bounds, matching the React Allotment pane. */
export const OBJECTS_SIDEBAR_MIN_WIDTH = 280
export const OBJECTS_SIDEBAR_MAX_WIDTH = 600
export const OBJECTS_SIDEBAR_INITIAL_WIDTH = 360

function clampObjectsWidth(width: number): number {
  return Math.min(
    OBJECTS_SIDEBAR_MAX_WIDTH,
    Math.max(OBJECTS_SIDEBAR_MIN_WIDTH, Math.round(width)),
  )
}

type PersistedConfig = {
  showSelection: boolean
  componentHighlightMode: ComponentHighlightMode
  showFocus: boolean
  wireframeMode: WireframeMode
  showPanels: boolean
  autoScrollToSelection: boolean
  autoExpandOnSelection: boolean
  showUnusedProperties: boolean
  showUnusedFonts: boolean
  showUnusedIcons: boolean
  showPlayground: boolean
  showCodeNames: boolean
  objectsView: ObjectsView
  objectsWidth: number
  useRefactoredSidebars: boolean
  chromeTheme: string
  interfaceMode: InterfaceMode
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
  const componentHighlightMode = ref<ComponentHighlightMode>(
    persisted.componentHighlightMode ?? "selection",
  )
  const showFocus = ref(persisted.showFocus ?? true)
  const wireframeMode = ref<WireframeMode>(persisted.wireframeMode ?? "auto")
  const showPanels = ref(persisted.showPanels ?? true)
  const autoScrollToSelection = ref(persisted.autoScrollToSelection ?? true)
  const autoExpandOnSelection = ref(persisted.autoExpandOnSelection ?? false)
  const showUnusedProperties = ref(persisted.showUnusedProperties ?? false)
  const showUnusedFonts = ref(persisted.showUnusedFonts ?? false)
  const showUnusedIcons = ref(persisted.showUnusedIcons ?? false)
  const showPlayground = ref(persisted.showPlayground ?? false)
  const showCodeNames = ref(persisted.showCodeNames ?? false)
  const objectsView = ref<ObjectsView>(persisted.objectsView ?? "components")
  const objectsWidth = ref(
    clampObjectsWidth(persisted.objectsWidth ?? OBJECTS_SIDEBAR_INITIAL_WIDTH),
  )
  const useRefactoredSidebars = ref(persisted.useRefactoredSidebars ?? false)
  const chromeTheme = ref(persisted.chromeTheme ?? "seldon")
  const interfaceMode = ref<InterfaceMode>(persisted.interfaceMode ?? "light")

  function toggleWireframeMode(mode?: "on" | "off"): void {
    wireframeMode.value =
      mode ??
      (wireframeMode.value === "auto" || wireframeMode.value === "off"
        ? "on"
        : "off")
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
  function setComponentHighlightMode(mode: ComponentHighlightMode): void {
    componentHighlightMode.value = mode
  }
  function setObjectsView(view: ObjectsView): void {
    objectsView.value = view
  }
  function setObjectsWidth(width: number): void {
    objectsWidth.value = clampObjectsWidth(width)
  }
  function setChromeTheme(slug: string): void {
    chromeTheme.value = slug
  }
  function setInterfaceMode(mode: InterfaceMode): void {
    interfaceMode.value = mode
  }

  watch(
    [
      showSelection,
      componentHighlightMode,
      showFocus,
      wireframeMode,
      showPanels,
      autoScrollToSelection,
      autoExpandOnSelection,
      showUnusedProperties,
      showUnusedFonts,
      showUnusedIcons,
      showPlayground,
      showCodeNames,
      objectsView,
      objectsWidth,
      useRefactoredSidebars,
      chromeTheme,
      interfaceMode,
    ],
    () => {
      if (typeof localStorage === "undefined") return
      const snapshot: PersistedConfig = {
        showSelection: showSelection.value,
        componentHighlightMode: componentHighlightMode.value,
        showFocus: showFocus.value,
        wireframeMode: wireframeMode.value,
        showPanels: showPanels.value,
        autoScrollToSelection: autoScrollToSelection.value,
        autoExpandOnSelection: autoExpandOnSelection.value,
        showUnusedProperties: showUnusedProperties.value,
        showUnusedFonts: showUnusedFonts.value,
        showUnusedIcons: showUnusedIcons.value,
        showPlayground: showPlayground.value,
        showCodeNames: showCodeNames.value,
        objectsView: objectsView.value,
        objectsWidth: objectsWidth.value,
        useRefactoredSidebars: useRefactoredSidebars.value,
        chromeTheme: chromeTheme.value,
        interfaceMode: interfaceMode.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    },
    { deep: false },
  )

  return {
    showSelection,
    componentHighlightMode,
    showFocus,
    wireframeMode,
    showPanels,
    autoScrollToSelection,
    autoExpandOnSelection,
    showUnusedProperties,
    showUnusedFonts,
    showUnusedIcons,
    showPlayground,
    showCodeNames,
    objectsView,
    objectsWidth,
    useRefactoredSidebars,
    chromeTheme,
    interfaceMode,
    toggleWireframeMode,
    togglePanels,
    toggleShowSelection,
    toggleShowFocus,
    toggleAutoExpandOnSelection,
    toggleAutoScrollToSelection,
    toggleShowCodeNames,
    toggleShowUnusedProperties,
    toggleShowUnusedFonts,
    toggleShowUnusedIcons,
    toggleShowPlayground,
    setComponentHighlightMode,
    setObjectsView,
    setObjectsWidth,
    setChromeTheme,
    setInterfaceMode,
  }
})
