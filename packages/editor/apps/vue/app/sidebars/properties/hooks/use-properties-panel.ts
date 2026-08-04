import { filterPropertySections } from "@seldon/editor/lib/properties/inspector/filter-property-sections"
import { computed, ref } from "vue"

import { useBoardStateMenu } from "./use-board-state-menu"
import { useFilterInput } from "./use-filter-input"
import { usePropertiesSidebar } from "./use-properties-sidebar"

import type { PropertySection } from "../types"
import type { PropertiesSidebarTree } from "./use-properties-sidebar"
import type { ComputedRef, Ref } from "vue"

/**
 * Shared body of the properties panel, consumed by both the docked
 * `PropertiesSidebar` and the floating `PanelPropertyController`. It owns the
 * inspector state, the filtered property tree, the filter field, and the
 * interaction-state menu, so the two shells render the exact same content and
 * only relocate the filter and state controls. Vue port of the React
 * `usePropertiesPanel`.
 */
export interface PropertiesPanel {
  tree: ComputedRef<PropertiesSidebarTree | null>
  isEmpty: ComputedRef<boolean>
  filteredSections: ComputedRef<PropertySection[]>
  filter: ReturnType<typeof useFilterInput>
  stateMenuOpen: Ref<boolean>
  stateMenuAnchor: Ref<HTMLElement | null>
  openStateMenu: (event: MouseEvent) => void
  closeStateMenu: () => void
  stateLabel: ComputedRef<string>
  stateDisabled: ComputedRef<boolean>
  stateItems: ComputedRef<ReturnType<typeof useBoardStateMenu>["value"]["items"]>
}

export function usePropertiesPanel(): PropertiesPanel {
  const state = usePropertiesSidebar()
  const filter = useFilterInput()
  const stateMenu = useBoardStateMenu()

  const tree = computed(() => (state.value.kind === "tree" ? state.value.tree : null))
  const isEmpty = computed(() => state.value.kind === "empty")

  // Live-filter the rendered rows by label or current value. The lookup table
  // (`allProperties`) stays full so a matched compound or shorthand parent can
  // still resolve its child rows.
  const filteredSections = computed<PropertySection[]>(() =>
    tree.value ? filterPropertySections(tree.value.sections, filter.query.value) : [],
  )

  // The header State menu selects the active interaction state for the selected
  // node's board tree. Its trigger is a ButtonMenu; the dropdown anchors to it
  // through the shared MenuController.
  const stateMenuOpen = ref(false)
  const stateMenuAnchor = ref<HTMLElement | null>(null)

  function openStateMenu(event: MouseEvent): void {
    stateMenuAnchor.value = event.currentTarget as HTMLElement
    stateMenuOpen.value = !stateMenuOpen.value
  }

  function closeStateMenu(): void {
    stateMenuOpen.value = false
  }

  const stateLabel = computed(() => stateMenu.value.label)
  const stateDisabled = computed(() => stateMenu.value.disabled)
  const stateItems = computed(() => stateMenu.value.items)

  return {
    tree,
    isEmpty,
    filteredSections,
    filter,
    stateMenuOpen,
    stateMenuAnchor,
    openStateMenu,
    closeStateMenu,
    stateLabel,
    stateDisabled,
    stateItems,
  }
}
