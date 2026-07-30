<script setup lang="ts">
// Gate for the Hari panel. Mounts the panel only while the "ai-chat" panel is
// active so it recenters on each open and its floating-window hooks run only when
// open, matching the other dialog view-models. Vue port of the React
// `HariController` gate.
import { usePanelStore } from "@app/editor/panel-store"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import HariPanel from "./HariPanel.vue"

const { activePanel } = storeToRefs(usePanelStore())

const isOpen = computed(() => activePanel.value === "ai-chat")
</script>

<template>
  <HariPanel v-if="isOpen" />
</template>
