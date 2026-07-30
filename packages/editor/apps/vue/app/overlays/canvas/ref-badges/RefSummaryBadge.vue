<script setup lang="ts">
import { useSelection } from "@app/workspace/use-selection"
import Frame from "@seldon/components/frames/Frame.vue"
import PanelRefs from "@seldon/components/modules/PanelRefs.vue"
import { computed } from "vue"

import {
  refBadgeBoxStyle,
  refBadgeHiddenCardStyle,
  refBadgeMutedStyle,
  refBadgePanelStyle,
  refBadgeStyle,
} from "./ref-badge-style"

import type { InstanceId, VariantId } from "@seldon/core/workspace/types"
import type { ConnectorPlacement } from "@seldon/editor/lib/canvas/connectors/connector-layout"

/**
 * Stands in for the refs one node holds, counting them rather than naming them.
 *
 * Clicking it selects that node, which is all it does. The overlay draws the selected
 * node and its descendants, so selecting it redraws these refs one level in, and the
 * count is a way into them rather than a thing to read.
 *
 * Mirrors the React `RefSummaryBadge`.
 */
const props = defineProps<{
  placement: ConnectorPlacement
  nodeId: string
}>()

const { selectNode } = useSelection()

const wrapperStyle = computed(() =>
  props.placement.muted
    ? refBadgeMutedStyle(props.placement.badge)
    : refBadgeStyle(props.placement.badge),
)
const summaryRefs = computed(() => ({
  refChip: { style: refBadgeBoxStyle(props.placement.badge.width) },
  refChipName: { children: props.placement.label },
  refCard: { style: refBadgeHiddenCardStyle },
}))
const showSlot = {}

function select(): void {
  selectNode(props.nodeId as VariantId | InstanceId)
}
</script>

<template>
  <Frame :style="wrapperStyle" @click="select">
    <PanelRefs
      role="presentation"
      :style="refBadgePanelStyle"
      :seldon-refs="summaryRefs"
      :chip-assist="showSlot"
      :text-label="showSlot"
    />
  </Frame>
</template>
