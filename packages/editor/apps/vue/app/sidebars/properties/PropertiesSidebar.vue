<script setup lang="ts">
// View-model for the docked properties sidebar. Renders the no-selection shell or
// the shared property tree, and offers a toggle that detaches the panel into the
// floating palette. The tree, filter, and interaction-state menu come from
// `usePropertiesPanel`, so the docked pane and the floating palette show the exact
// same content and only relocate the filter and state controls.
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import MenuController from "@app/menus/MenuController.vue"
import SidebarProperties from "@seldon/components/modules/SidebarProperties.vue"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import PropertyTree from "./PropertyTree.vue"
import { usePropertiesPanel } from "./hooks/use-properties-panel"

import type { Workspace } from "@seldon/core"

defineProps<{ workspace?: Workspace }>()

const config = useEditorConfigStore()
const { propertiesFloating } = storeToRefs(config)

const {
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
} = usePropertiesPanel()

// The tree slot grows to hold the scroller only when a tree is present, so the
// no-selection shell keeps its own height.
const treeContentStyle = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
}

// Drive every header slot through its stable workspace ref. The filter field, the
// State trigger, its label, and the dock toggle are conditional slots, so they
// keep a positional `{}` enabler to render; their data flows through `seldonRefs`.
const seldonRefs = computed(() => ({
  propertyFilterField: filter.comboboxField.value,
  propertyFilter: filter.input.value,
  propertyFilterClear: filter.buttonIconic.value ?? {},
  boardState: {
    onClick: openStateMenu,
    disabled: stateDisabled.value,
    "data-testid": "board-state-trigger",
  },
  boardStateLabel: { children: stateLabel.value },
  propertyTogglePanel: {
    onClick: config.floatProperties,
    "aria-pressed": propertiesFloating.value,
    title: "Detach panel",
    "data-testid": "properties-dock-toggle",
  },
  propertiesTree: isEmpty.value ? {} : { style: treeContentStyle },
}))
</script>

<template>
  <SidebarProperties
    class="properties-sidebar"
    data-testid="properties-sidebar"
    :seldon-refs="seldonRefs"
    :combobox-field-filter="{}"
    :button-menu="{}"
    :text-label="{}"
    :button-toggle="{}"
  >
    <template v-if="!isEmpty && tree" #propertiesTree>
      <PropertyTree :tree="tree" :sections="filteredSections" />
    </template>
  </SidebarProperties>

  <MenuController
    :open="stateMenuOpen"
    :anchor="stateMenuAnchor"
    :items="stateItems"
    align="end"
    @close="closeStateMenu"
  />
</template>

<style scoped>
.properties-sidebar {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
