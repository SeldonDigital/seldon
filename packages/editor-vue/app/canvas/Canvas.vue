<script setup lang="ts">
import type { Workspace } from "@lib/core"
import { usePanZoom } from "@lib/canvas/use-pan-zoom"
import { getBoardVariantRootIds } from "@seldon/editor/lib/workspace/workspace-accessors"
import { computed, ref } from "vue"
import CanvasNode from "./CanvasNode.vue"
import SelectionOverlay from "./SelectionOverlay.vue"
import ZoomControls from "./ZoomControls.vue"

const props = defineProps<{ workspace: Workspace }>()

const scrollEl = ref<HTMLElement | null>(null)
const {
  scale,
  translateX,
  translateY,
  isPanning,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
} = usePanZoom(scrollEl)

const contentStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  transformOrigin: "0 0",
}))

type BoardEntry = {
  key: string
  name: string
  rootIds: string[]
}

const boards = computed<BoardEntry[]>(() =>
  Object.entries(props.workspace.boards)
    .filter(
      ([, board]) =>
        (board as { type?: string }).type === "component" ||
        (board as { type?: string }).type === "playground",
    )
    .map(([key, board]) => ({
      key,
      name: (board as { name?: string }).name ?? key,
      rootIds: getBoardVariantRootIds(board),
    })),
)
</script>

<template>
  <div
    ref="scrollEl"
    class="canvas-viewport"
    :class="{ 'is-panning': isPanning }"
    @wheel="onWheel"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <div class="canvas-content" :style="contentStyle">
      <section v-for="board in boards" :key="board.key" class="canvas-board">
        <header class="canvas-board__label">{{ board.name }}</header>
        <div class="canvas-board__surface">
          <CanvasNode
            v-for="rootId in board.rootIds"
            :key="rootId"
            :workspace="workspace"
            :node-id="rootId"
          />
        </div>
      </section>
    </div>
    <SelectionOverlay :container="scrollEl" />
    <ZoomControls />
  </div>
</template>

<style scoped>
.canvas-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f4f4f5;
  touch-action: none;
}
.canvas-viewport.is-panning {
  cursor: grabbing;
}
.canvas-content {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-content: flex-start;
  will-change: transform;
}
.canvas-board {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.canvas-board__label {
  font-size: 0.75rem;
  color: #71717a;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.canvas-board__surface {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
