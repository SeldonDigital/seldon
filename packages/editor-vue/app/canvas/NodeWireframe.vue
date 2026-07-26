<script setup lang="ts">
import { getWireframeMode } from "@seldon/editor/lib/canvas/overlay/geometry"
import { calculateClippingBox } from "@seldon/editor/lib/canvas/overlay/measure"
import { COLORS } from "@seldon/editor/lib/helpers/colors"
import type { CSSProperties } from "vue"
import { computed } from "vue"

import { useNodeRect } from "./use-node-rects"

const props = withDefaults(
  defineProps<{ nodeId: string; isSelected?: boolean }>(),
  { isSelected: false },
)

const trackedRect = useNodeRect(props.nodeId)

// Hover and selection borders are drawn by the single canvas overlays, so the
// selected node is skipped here; its selection outline covers it.
const style = computed<CSSProperties | null>(() => {
  if (props.isSelected) return null
  const rect = trackedRect.value
  if (!rect) return null
  const clipped = calculateClippingBox({ nodeId: props.nodeId, rect })
  if (!clipped) return null
  const box = getWireframeMode(clipped)
  return {
    position: "absolute",
    pointerEvents: "none",
    boxSizing: box.boxSizing,
    borderStyle: "dashed",
    borderColor: COLORS.primary[500],
    borderWidth: `${box.borderWidth}px`,
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    zIndex: 1,
  }
})
</script>

<template>
  <div v-if="style" :style="style" />
</template>
