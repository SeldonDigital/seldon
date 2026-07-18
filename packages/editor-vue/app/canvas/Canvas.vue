<script setup lang="ts">
import type { Workspace } from "@lib/core"
import { usePanZoom } from "@lib/canvas/use-pan-zoom"
import { useCanvasTracking } from "@lib/canvas/use-canvas-tracking"
import { useBoardStateStore } from "@lib/stores/board-state-store"
import { useEditorConfigStore } from "@lib/stores/editor-config-store"
import { usePreviewModeStore } from "@lib/stores/preview-mode-store"
import { getBoardVariantRootIds } from "@seldon/editor/lib/workspace/workspace-accessors"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import CanvasNode from "./CanvasNode.vue"
import HoverOverlay from "./HoverOverlay.vue"
import SelectionOverlay from "./SelectionOverlay.vue"
import ZoomControls from "./ZoomControls.vue"

const props = defineProps<{ workspace: Workspace }>()

const boardState = useBoardStateStore()
const config = useEditorConfigStore()
const previewMode = usePreviewModeStore()
const { onCanvasClick, onCanvasPointerMove, onCanvasPointerLeave } =
  useCanvasTracking()

const { showSelection } = storeToRefs(config)
const { isInPreviewMode } = storeToRefs(previewMode)

// Selection and hover chrome hide when the user turns them off (`h`) or enters
// device preview (`p`), so the canvas shows the design without editor overlays.
const showOverlays = computed(
  () => showSelection.value && !isInPreviewMode.value,
)

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
    @pointerleave="onCanvasPointerLeave"
  >
    <div
      class="canvas-content"
      :style="contentStyle"
      @click="onCanvasClick"
      @pointermove="onCanvasPointerMove"
    >
      <section v-for="board in boards" :key="board.key" class="canvas-board">
        <header class="canvas-board__label">{{ board.name }}</header>
        <div
          class="canvas-board__surface"
          :data-selection-id="board.key"
          data-selection-kind="board"
        >
          <CanvasNode
            v-for="rootId in board.rootIds"
            :key="rootId"
            :workspace="workspace"
            :node-id="rootId"
            :active-state="boardState.getActiveState(board.key)"
          />
        </div>
      </section>
    </div>
    <SelectionOverlay v-if="showOverlays" :container="scrollEl" />
    <HoverOverlay v-if="showOverlays" :container="scrollEl" />
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
