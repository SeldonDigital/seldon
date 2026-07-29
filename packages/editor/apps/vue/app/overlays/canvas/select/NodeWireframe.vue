<script setup lang="ts">
import { useSharedStore } from "@app/canvas/use-shared-store"
import { useNodeRect } from "@app/overlays/hooks/use-node-rects"
import { anchoredNodesStore } from "@seldon/editor/lib/canvas/connectors/anchored-nodes-store"
import { getWireframeMode } from "@seldon/editor/lib/canvas/overlay/geometry"
import { calculateClippingBox } from "@seldon/editor/lib/canvas/overlay/measure"
import { computed } from "vue"

import { nodeWireframeAnchoredStyle, nodeWireframeStyle } from "./node-wireframe-style"

import type { CSSProperties } from "vue"

const props = withDefaults(defineProps<{ nodeId: string; isSelected?: boolean }>(), {
  isSelected: false,
})

const trackedRect = useNodeRect(props.nodeId)

// Read as one boolean, so a box only draws again when a connector starts or stops
// meeting its own node rather than whenever any of them move.
const isAnchored = useSharedStore(anchoredNodesStore, (state) => state.nodeIds.has(props.nodeId))

// Hover and selection borders are drawn by the single canvas overlays, so the
// selected node is skipped here; its selection outline covers it.
const style = computed<CSSProperties | null>(() => {
  if (props.isSelected) return null
  const rect = trackedRect.value
  if (!rect) return null
  const clipped = calculateClippingBox({ nodeId: props.nodeId, rect })
  if (!clipped) return null
  const box = getWireframeMode(clipped)

  return isAnchored.value ? nodeWireframeAnchoredStyle(box) : nodeWireframeStyle(box)
})
</script>

<template>
  <div v-if="style" :style="style" />
</template>
