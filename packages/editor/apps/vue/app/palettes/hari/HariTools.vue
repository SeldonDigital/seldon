<script setup lang="ts">
// View-model for the tool-activity block in the Hari transcript. The design
// splits the block in two: MessageToolsHeader renders the collapsible header once
// and MessageToolsUsed renders one line per entry, so every part comes from a
// generated component. This adapter owns the runtime pieces a static schema
// cannot: the expand/collapse state and the list built from the turn's activity.
// Vue port of the React `HariTools`.
import MessageToolsHeader from "@seldon/components/elements/MessageToolsHeader.vue"
import MessageToolsUsed from "@seldon/components/elements/MessageToolsUsed.vue"
import { computed, ref } from "vue"

import type { ToolUsed } from "./tools-used"

const props = defineProps<{
  tools: ToolUsed[]
  /** Initial expanded state, seeded from the Show Tools flag. */
  defaultOpen: boolean
}>()

const open = ref(props.defaultOpen)

function toggle(): void {
  open.value = !open.value
}

const headerRefs = computed(() => ({
  hariToolsToggle: {
    onClick: toggle,
    "aria-expanded": open.value,
    "aria-label": open.value ? "Hide tools" : "Show tools",
  },
  hariToolsChevron: {
    icon: open.value ? "material-keyboardArrowDown" : "material-chevronRight",
  },
}))

const visibleTools = computed(() => (open.value ? props.tools : []))

function toolRefs(tool: ToolUsed) {
  return {
    hariToolIcon: { icon: tool.icon },
    hariToolText: { children: tool.text },
  }
}
</script>

<template>
  <MessageToolsHeader :button-iconic="{}" :text-description="{}" :seldon-refs="headerRefs" />
  <MessageToolsUsed
    v-for="tool in visibleTools"
    :key="tool.key"
    :icon="{}"
    :text-description="{}"
    :seldon-refs="toolRefs(tool)"
  />
</template>
