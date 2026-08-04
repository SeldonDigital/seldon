<script setup lang="ts">
// Gate for the floating properties palette. Mounts the palette only while it is
// detached and shown, so it recenters on each open and its floating-window hooks
// run only while open, matching the Hari view-model. The panel's saved rect
// reopens it where the user left it. Vue port of the React
// `PanelPropertyController` gate.
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import FloatingPanel from "@app/windows/FloatingPanel.vue"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import PropertyPalette from "./PropertyPalette.vue"

const PROPERTY_INITIAL_WIDTH = 320
const PROPERTY_INITIAL_HEIGHT = 520

const config = useEditorConfigStore()
const { propertiesFloating, propertiesFloatingOpen, propertiesPanelRect } = storeToRefs(config)

const isOpen = computed(() => propertiesFloating.value && propertiesFloatingOpen.value)

function close(): void {
  config.setPropertiesFloatingOpen(false)
}
</script>

<template>
  <FloatingPanel
    v-if="isOpen"
    :initial-width="PROPERTY_INITIAL_WIDTH"
    :initial-height="PROPERTY_INITIAL_HEIGHT"
    :on-close="close"
    palette-id="properties"
    test-id="properties-palette"
    placement="right"
    :rect="propertiesPanelRect"
    :on-rect-change="config.setPropertiesPanelRect"
    #default="{ startDrag }"
  >
    <PropertyPalette :start-drag="startDrag" />
  </FloatingPanel>
</template>
