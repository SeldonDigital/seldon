<script setup lang="ts">
// Every badge drawn once more, hidden, and measured to place the drawn ones.
//
// A badge in the gutter is placed absolutely, so it can neither size itself to its
// neighbors nor report a height and spacing the column could read before it is placed.
// These are the same badges at their natural size, which is what the widest width, the
// height, and the badge's own gap are taken from. Vue port of the React `TokenBadgeMeasure`.
import Frame from "@seldon/components/frames/Frame.vue"
import PanelToken from "@seldon/components/modules/PanelToken.vue"
import { computed } from "vue"

import {
  tokenBadgeHiddenCardStyle,
  tokenBadgeMeasureLabelStyle,
  tokenBadgeMeasureStyle,
  tokenBadgePanelStyle,
} from "./token-badge-style"

import type { TokenSource } from "@seldon/editor/lib/canvas/connectors/token-sources"

const props = defineProps<{ sources: TokenSource[] }>()

const badges = computed(() =>
  props.sources.map((source) => ({
    key: source.key,
    seldonRefs: {
      tokenChipName: { children: source.name, style: tokenBadgeMeasureLabelStyle },
      tokenChipValue: { children: source.value },
      tokenChipIcon: { icon: source.icon },
      tokenCard: { style: tokenBadgeHiddenCardStyle },
    },
  })),
)
const showSlot = {}
</script>

<template>
  <Frame :style="tokenBadgeMeasureStyle">
    <PanelToken
      v-for="badge in badges"
      :key="badge.key"
      role="presentation"
      :style="tokenBadgePanelStyle"
      :seldon-refs="badge.seldonRefs"
      :chip-assist="showSlot"
      :text-label="showSlot"
      :text-label2="showSlot"
    />
  </Frame>
</template>
