<script setup lang="ts">
// View-model for the reasoning block in the Hari transcript. The generated
// MessageThinking supplies the frame, label, and toggle button; this adapter owns
// the runtime pieces a static schema cannot: the expand/collapse state, the
// dynamic header label, and the collapsed/expanded body text treatment.
// Vue port of the React `HariThinking`.
import MessageThinking from "@seldon/components/elements/MessageThinking.vue"
import { computed, ref } from "vue"

import type { CSSProperties } from "vue"

const props = defineProps<{
  text: string
  /** Set once thinking completes; drives the header label and the elapsed time. */
  durationMs?: number
  /** True when reasoning was clamped off for this turn; shows a "Clamped" tag. */
  clamped?: boolean
}>()

const open = ref(true)

const collapsedStyle: CSSProperties = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}

const expandedStyle: CSSProperties = { whiteSpace: "pre-wrap" }

const label = computed(() => {
  if (props.durationMs !== undefined) {
    return `Thought for ${Math.max(1, Math.round(props.durationMs / 1000))}s`
  }

  return props.clamped ? "Reasoning off" : "Thinking..."
})

const seldonRefs = computed(() => ({
  hariReasoningToggle: {
    onClick: () => {
      open.value = !open.value
    },
    "aria-expanded": open.value,
    "aria-label": open.value ? "Hide reasoning" : "Show reasoning",
  },
  hariReasoningChevron: {
    icon: open.value ? "material-keyboardArrowDown" : "material-chevronRight",
  },
  hariReasoningLabel: { children: label.value },
  hariReasoningBody: {
    children: props.text,
    style: open.value ? expandedStyle : collapsedStyle,
  },
}))

// The clamped tag and the body only exist for some turns, and a ref override
// cannot turn a slot on, so their presence stays a positional decision while
// their values come through refs.
const clampedSlot = computed(() => (props.clamped ? {} : null))
const bodySlot = computed(() => (props.text ? {} : null))
</script>

<template>
  <MessageThinking
    :button-iconic="{}"
    :text-description="{}"
    :text-description2="clampedSlot"
    :text-description3="bodySlot"
    :seldon-refs="seldonRefs"
  />
</template>
