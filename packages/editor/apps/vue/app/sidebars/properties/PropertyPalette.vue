<script setup lang="ts">
// Body of the floating properties palette. Renders the shared `PanelPalette`
// shell: `BarState` fills the top bar, the shared property tree fills the
// contents zone, and `BarFilter` fills the bottom bar. The option button re-docks
// the panel and the close button hides it. The tree, filter, and state menu come
// from `usePropertiesPanel`, so the palette shows the exact same tree as the
// docked sidebar; only the filter and state controls change location. The
// enclosing `FloatingPanel` owns the window and hands down `startDrag`. Vue port
// of the React `PropertyPalette`.
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import MenuController from "@app/menus/MenuController.vue"
import PanelPalette from "@seldon/components/modules/PanelPalette.vue"
import BarFilter from "@seldon/components/parts/BarFilter.vue"
import BarState from "@seldon/components/parts/BarState.vue"
import { computed } from "vue"

import PropertyTree from "./PropertyTree.vue"
import { usePropertiesPanel } from "./hooks/use-properties-panel"

import type { CSSProperties } from "vue"

const props = defineProps<{
  startDrag: (event: PointerEvent) => void
}>()

const config = useEditorConfigStore()

const {
  tree,
  filteredSections,
  filter,
  stateMenuOpen,
  stateMenuAnchor,
  openStateMenu,
  closeStateMenu,
  stateLabel,
  stateDisabled,
  stateItems,
} = usePropertiesPanel()

// Re-docking reveals the docked pane, even if it was previously hidden via Show
// Properties.
function dock(): void {
  config.setPropertiesFloating(false)
  config.setPropertiesDockedOpen(true)
}

function close(): void {
  config.setPropertiesFloatingOpen(false)
}

const styles: Record<string, CSSProperties> = {
  dialog: { width: "100%", height: "100%", display: "flex", flexDirection: "column" },
  dragHandle: { cursor: "grab", userSelect: "none", touchAction: "none" },
  optionIcon: { transform: "rotate(90deg)" },
}

const seldonRefs = computed(() => ({
  paletteTopBar: { onPointerdown: props.startDrag, style: styles.dragHandle },
  paletteOption: {
    onClick: dock,
    title: "Dock panel",
    "data-testid": "properties-dock-toggle",
  },
  paletteOptionIcon: { icon: "seldon-panels", style: styles.optionIcon },
  paletteClose: { onClick: close, "data-testid": "properties-palette-close" },
  propertyState: {
    onClick: openStateMenu,
    disabled: stateDisabled.value,
    "data-testid": "board-state-trigger",
  },
  propertyStateLabel: { children: stateLabel.value },
  filterField: filter.comboboxField.value,
}))

const emptySlot = {}
const dialogStyle = styles.dialog
const contentsSlot = {
  style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" } as CSSProperties,
}
const filterInput = computed(() => filter.input.value)
const filterButtonIconic = computed(() => filter.buttonIconic.value ?? {})
</script>

<template>
  <PanelPalette
    :style="dialogStyle"
    :seldon-refs="seldonRefs"
    :button-iconic="emptySlot"
    :button-iconic2="emptySlot"
    :frame3="contentsSlot"
  >
    <template #paletteTopBarSlot>
      <BarState :button-menu="emptySlot" :text-label="emptySlot" :seldon-refs="seldonRefs" />
    </template>

    <template #paletteContents>
      <PropertyTree v-if="tree" :tree="tree" :sections="filteredSections" />
    </template>

    <template #paletteBottomBarSlot>
      <BarFilter
        :combobox-field="emptySlot"
        :input="filterInput"
        :button-iconic="filterButtonIconic"
        :seldon-refs="seldonRefs"
      />
    </template>
  </PanelPalette>

  <MenuController
    :open="stateMenuOpen"
    :anchor="stateMenuAnchor"
    :items="stateItems"
    align="end"
    @close="closeStateMenu"
  />
</template>
