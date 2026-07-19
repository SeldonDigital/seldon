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
    useRefactoredSidebars,
    chromeTheme,
    interfaceMode,
    toggleWireframeMode,
  }
})
