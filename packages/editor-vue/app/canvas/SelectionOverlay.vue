<script setup lang="ts">
import { useRectStore } from "@app/tracking/rect-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { storeToRefs } from "pinia"
import { onBeforeUnmount, onMounted, ref, watch } from "vue"

const props = defineProps<{ container: HTMLElement | null }>()

const selection = useSelectionStore()
const rects = useRectStore()
const { selectedNodeId } = storeToRefs(selection)

const box = ref<{
  top: number
  left: number
  width: number
  height: number
} | null>(null)

let frame = 0

function measure(): void {
  const id = selectedNodeId.value
  const container = props.container
  if (!id || !container) {
    box.value = null
    rects.setSelectedRect(null)
    return
  }
  const el = container.querySelector<HTMLElement>(
    `[data-canvas-node-id="${id}"]`,
  )
  if (!el) {
    box.value = null
    rects.setSelectedRect(null)
    return
  }
  const elRect = el.getBoundingClientRect()
  const hostRect = container.getBoundingClientRect()
  const next = {
    top: elRect.top - hostRect.top + container.scrollTop,
    left: elRect.left - hostRect.left + container.scrollLeft,
    width: elRect.width,
    height: elRect.height,
  }
  box.value = next
  rects.setSelectedRect(next)
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

watch(selectedNodeId, measure)
</script>

<template>
  <div
    v-if="box"
    class="selection-overlay"
    :style="{
      top: `${box.top}px`,
      left: `${box.left}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    }"
  />
</template>

<style scoped>
.selection-overlay {
  position: absolute;
  pointer-events: none;
  outline: 2px solid #6366f1;
  outline-offset: 0;
  z-index: 10;
  border-radius: 2px;
}
</style>
