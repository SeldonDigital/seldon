<script setup lang="ts">
import { useObjectHoverStore } from "@lib/stores/object-hover-store"
import { useSelectionStore } from "@lib/stores/selection-store"
import { useToolStore } from "@lib/stores/tool-store"
import { storeToRefs } from "pinia"
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

const props = defineProps<{ container: HTMLElement | null }>()

const hover = useObjectHoverStore()
const selection = useSelectionStore()
const tool = useToolStore()
const { hoveredId, hoveredKind } = storeToRefs(hover)
const { selectedNodeId } = storeToRefs(selection)
const { activeTool } = storeToRefs(tool)

const isInsertTool = computed(() => activeTool.value === "component")

const box = ref<{
  top: number
  left: number
  width: number
  height: number
} | null>(null)

let frame = 0

function measure(): void {
  const id = hoveredId.value
  const container = props.container
  // Skip the outline when nothing is hovered or the hovered object is not a
  // canvas node. The already-selected node is normally skipped, but the insert
  // tool keeps its outline so it reads as a valid insertion target.
  if (
    !id ||
    !container ||
    hoveredKind.value !== "node" ||
    (id === selectedNodeId.value && !isInsertTool.value)
  ) {
    box.value = null
    return
  }
  const el = container.querySelector<HTMLElement>(
    `[data-canvas-node-id="${id}"]`,
  )
  if (!el) {
    box.value = null
    return
  }
  const elRect = el.getBoundingClientRect()
  const hostRect = container.getBoundingClientRect()
  box.value = {
    top: elRect.top - hostRect.top + container.scrollTop,
    left: elRect.left - hostRect.left + container.scrollLeft,
    width: elRect.width,
    height: elRect.height,
  }
}

function loop(): void {
  measure()
  frame = requestAnimationFrame(loop)
}

onMounted(() => {
  frame = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
})
</script>

<template>
  <div
    v-if="box"
    class="hover-overlay"
    :class="{ 'hover-overlay--insert': isInsertTool }"
    :style="{
      top: `${box.top}px`,
      left: `${box.left}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    }"
  />
</template>

<style scoped>
.hover-overlay {
  position: absolute;
  pointer-events: none;
  outline: 1px solid #a5b4fc;
  outline-offset: 0;
  z-index: 9;
  border-radius: 2px;
}
.hover-overlay--insert {
  outline: 2px solid #6366f1;
  background: rgba(99, 102, 241, 0.08);
}
</style>
