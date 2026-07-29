<script setup lang="ts">
import Frame from "@seldon/components/frames/Frame.vue"
import PanelRefs from "@seldon/components/modules/PanelRefs.vue"
import { computed } from "vue"

import {
  refBadgeBoxStyle,
  refBadgeHiddenCardStyle,
  refBadgePanelStyle,
  refOmittedStyle,
} from "./ref-badge-style"

import type { BadgeBox } from "@seldon/editor/lib/canvas/connectors/connector-layout"

/**
 * Reports the refs that did not fit the gutter.
 *
 * Drawn rather than dropped silently, so a selection with more refs than the column
 * holds says so instead of appearing to have fewer. Carries no connector and opens
 * no card, so it is drawn muted. Mirrors the React `RefOmitted`.
 */
const props = defineProps<{
  badge: BadgeBox
  count: number
}>()

const wrapperStyle = computed(() => refOmittedStyle(props.badge))
const badgeBox = computed(() => ({ style: refBadgeBoxStyle(props.badge.width) }))
const omittedRefs = computed(() => ({
  refChipName: { children: `+${props.count} more` },
  refCard: { style: refBadgeHiddenCardStyle },
}))
const showSlot = {}
</script>

<template>
  <Frame :style="wrapperStyle">
    <PanelRefs
      role="presentation"
      :style="refBadgePanelStyle"
      :seldon-refs="omittedRefs"
      :chip-assist="badgeBox"
      :text-label="showSlot"
    />
  </Frame>
</template>
