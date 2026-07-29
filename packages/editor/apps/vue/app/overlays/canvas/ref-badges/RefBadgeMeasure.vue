<script setup lang="ts">
import Frame from "@seldon/components/frames/Frame.vue"
import PanelRefs from "@seldon/components/modules/PanelRefs.vue"
import { computed } from "vue"

import {
  refBadgeHiddenCardStyle,
  refBadgeMeasureLabelStyle,
  refBadgeMeasureStyle,
  refBadgePanelStyle,
} from "./ref-badge-style"

/**
 * Every badge drawn once more, hidden, and measured to place the drawn ones.
 *
 * A badge in the gutter is placed absolutely, so it can neither size itself to its
 * neighbors nor report a height and spacing the column could read before it is placed.
 * These are the same badges at their natural size, which is what the widest width, the
 * height, and the badge's own gap are taken from.
 *
 * Mirrors the React `RefBadgeMeasure`.
 */
const props = defineProps<{ labels: string[] }>()

const badges = computed(() =>
  props.labels.map((label, index) => ({
    key: `${label}#${index}`,
    seldonRefs: {
      refChipName: { children: label, style: refBadgeMeasureLabelStyle },
      refCard: { style: refBadgeHiddenCardStyle },
    },
  })),
)
const showSlot = {}
</script>

<template>
  <Frame :style="refBadgeMeasureStyle">
    <PanelRefs
      v-for="badge in badges"
      :key="badge.key"
      role="presentation"
      :style="refBadgePanelStyle"
      :seldon-refs="badge.seldonRefs"
      :chip-assist="showSlot"
      :text-label="showSlot"
    />
  </Frame>
</template>
