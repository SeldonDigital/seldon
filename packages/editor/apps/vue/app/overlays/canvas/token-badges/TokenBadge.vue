<script setup lang="ts">
// One property token at the end of a connector, opening its control card when clicked.
//
// The badge and the card are the same `PanelToken` component, drawn twice. This instance
// hides the card half, and the card's instance fills it with the live property control,
// so both surfaces take their look from one schema. The wrapper carries the placement and
// the click, because a module takes no element ref. Vue port of the React `TokenBadge`.
import Frame from "@seldon/components/frames/Frame.vue"
import PanelToken from "@seldon/components/modules/PanelToken.vue"
import { computed, toRef } from "vue"

import TokenCardController from "./TokenCardController.vue"
import { useTokenCard } from "./hooks/use-token-card"
import {
  tokenBadgeBoxStyle,
  tokenBadgeHiddenCardStyle,
  tokenBadgeMutedStyle,
  tokenBadgePanelStyle,
  tokenBadgeStyle,
} from "./token-badge-style"

import type { TokenBadgePlacement } from "@seldon/editor/lib/canvas/connectors/token-connectors"
import type { TokenSource } from "@seldon/editor/lib/canvas/connectors/token-sources"

const props = defineProps<{
  placement: TokenBadgePlacement
  source: TokenSource
}>()

const badge = toRef(() => props.placement.badge)
const { badgeRef, setCardEl, position, toggle, close } = useTokenCard(badge)

const wrapperStyle = computed(() =>
  props.placement.muted ? tokenBadgeMutedStyle(badge.value) : tokenBadgeStyle(badge.value),
)
const badgeRefs = computed(() => ({
  tokenChip: { style: tokenBadgeBoxStyle(badge.value.width) },
  tokenChipName: { children: props.source.name },
  tokenChipValue: { children: props.source.value },
  tokenChipIcon: { icon: props.source.icon },
  tokenCard: { style: tokenBadgeHiddenCardStyle },
}))
const showSlot = {}
</script>

<template>
  <Frame ref="badgeRef" :style="wrapperStyle" @click="toggle">
    <PanelToken
      role="presentation"
      :style="tokenBadgePanelStyle"
      :seldon-refs="badgeRefs"
      :chip-assist="showSlot"
      :text-label="showSlot"
      :text-label2="showSlot"
    />
  </Frame>
  <TokenCardController
    v-if="position"
    :property-key="source.propertyKey"
    :position="position"
    :set-card-el="setCardEl"
    :on-close="close"
  />
</template>
