<script setup lang="ts">
import Frame from "@seldon/components/frames/Frame.vue"
import PanelRefs from "@seldon/components/modules/PanelRefs.vue"
import { computed, toRef } from "vue"

import RefCardController from "./RefCardController.vue"
import { useRefCard } from "./hooks/use-ref-card"
import {
  refBadgeBoxStyle,
  refBadgeHiddenCardStyle,
  refBadgeMutedStyle,
  refBadgePanelStyle,
  refBadgeStyle,
} from "./ref-badge-style"

import type { ConnectorPlacement } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"

/**
 * The ref name at the end of a connector, opening its card when clicked.
 *
 * The badge and the card are the same `PanelRefs` component, drawn twice. This instance
 * hides the card half and the card's instance leaves the badge out, so both surfaces
 * take their look from one schema.
 *
 * The wrapper carries the placement and the click, because a module takes no element ref.
 *
 * `chipAssist` and `refChipName` are the schema's own names for the badge slot and its
 * label, so they read as chip here until the workspace renames them.
 *
 * Mirrors the React `RefBadge`.
 */
const props = defineProps<{
  placement: ConnectorPlacement
  binding: RefBinding
}>()

const badge = toRef(() => props.placement.badge)
const { badgeRef, setCardEl, position, toggle, close } = useRefCard(badge)

const wrapperStyle = computed(() =>
  props.placement.muted ? refBadgeMutedStyle(badge.value) : refBadgeStyle(badge.value),
)
const badgeRefs = computed(() => ({
  refChip: { style: refBadgeBoxStyle(badge.value.width) },
  refChipName: { children: props.placement.label },
  refCard: { style: refBadgeHiddenCardStyle },
}))
const showSlot = {}
</script>

<template>
  <Frame ref="badgeRef" :style="wrapperStyle" @click="toggle">
    <PanelRefs
      role="presentation"
      :style="refBadgePanelStyle"
      :seldon-refs="badgeRefs"
      :chip-assist="showSlot"
      :text-label="showSlot"
    />
  </Frame>
  <RefCardController
    v-if="position"
    :binding="binding"
    :position="position"
    :set-card-el="setCardEl"
    :on-close="close"
  />
</template>
