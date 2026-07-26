<script setup lang="ts">
import type { CSSProperties } from "vue"
import { Workspace, ValueType, getNodeProperties, getCssFromProperties } from "@app/core"
import { usePanZoom } from "@app/canvas/use-pan-zoom"
import { useCanvasTracking } from "@app/canvas/use-canvas-tracking"
import { useBoardStateStore } from "@app/canvas/board-state-store"
import { useActiveBoard } from "@app/canvas/use-active-board"
import { usePreviewModeStore } from "@app/editor/preview-mode-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { getBoardVariantRootIds } from "@seldon/editor/lib/workspace/workspace-accessors"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import type { FontFamilyValue } from "@seldon/core/properties/values/typography/font/font-family"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"
import CanvasNode from "./CanvasNode.vue"
import CanvasTracking from "./CanvasTracking.vue"
import ZoomControls from "./ZoomControls.vue"

const props = defineProps<{ workspace: Workspace }>()

const boardState = useBoardStateStore()
const previewMode = usePreviewModeStore()
const selection = useSelectionStore()
const { activeBoard, activeBoardKey } = useActiveBoard()
const { onCanvasClick, onCanvasPointerMove, onCanvasPointerLeave } =
  useCanvasTracking()

const { isInPreviewMode } = storeToRefs(previewMode)
const {
  selectedBoardId,
  selectedNodeId,
  selectedResourceEntry,
  workspaceSelected,
} = storeToRefs(selection)

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

// Bridges pan/zoom transform changes to the shared overlay tracker so the
// selection, hover, and wireframe outlines stay glued while the canvas moves.
// Phase 6 replaces this with the shared pan/zoom engine's own subscription.
const transformListeners = new Set<() => void>()
watch([scale, translateX, translateY], () => {
  for (const listener of transformListeners) listener()
})
function subscribeTransform(listener: () => void): () => void {
  transformListeners.add(listener)
  return () => {
    transformListeners.delete(listener)
  }
}

// The board root carries the theme's primary font so canvas text that inherits
// its family follows the active theme, matching React's ComponentBoard.
const PRIMARY_FONT_FAMILY = {
  type: ValueType.THEME_CATEGORICAL,
  value: "@fontFamily.primary",
} as unknown as FontFamilyValue

const boardClassName = computed(() =>
  activeBoardKey.value ? `board-${activeBoardKey.value}` : "",
)

const boardProperties = computed(() =>
  activeBoard.value
    ? getNodeProperties(activeBoard.value, props.workspace)
    : undefined,
)

const boardTheme = computed(() =>
  activeBoard.value
    ? workspaceThemeService.getObjectTheme(activeBoard.value, props.workspace)
    : undefined,
)

const boardThemeId = computed(() =>
  activeBoard.value
    ? workspaceThemeService.getObjectThemeId(activeBoard.value, props.workspace)
    : undefined,
)

const boardRootIds = computed(() =>
  activeBoard.value ? getBoardVariantRootIds(activeBoard.value) : [],
)

const boardCss = computed(() => {
  if (!boardProperties.value || !boardTheme.value) return ""
  try {
    return getCssFromProperties(
      boardProperties.value,
      {
        theme: boardTheme.value,
        properties: boardProperties.value,
        parentContext: null,
      },
      boardClassName.value,
    )
  } catch (error) {
    console.error("Board CSS generation error:", error)
    return ""
  }
})

const boardRootStyle = computed<CSSProperties>(() => {
  const family = boardTheme.value
    ? resolveFontFamily({ fontFamily: PRIMARY_FONT_FAMILY, theme: boardTheme.value })
        ?.value
    : undefined
  const base: CSSProperties = { position: "static" }
  return family ? { ...base, fontFamily: family } : base
})

const boardActiveState = computed(() =>
  activeBoardKey.value
    ? boardState.getActiveState(activeBoardKey.value)
    : undefined,
)

// Ordered component and playground boards, used to auto-select the first board
// when nothing is selected so the canvas is never empty on load.
const orderedBoardKeys = computed<string[]>(() =>
  Object.entries(props.workspace.boards)
    .filter(
      ([, board]) =>
        (board as { type?: string }).type === "component" ||
        (board as { type?: string }).type === "playground",
    )
    .map(([key]) => key),
)

watch(
  [activeBoard, orderedBoardKeys],
  () => {
    if (
      !activeBoard.value &&
      !selectedBoardId.value &&
      !selectedNodeId.value &&
      !selectedResourceEntry.value &&
      !workspaceSelected.value &&
      orderedBoardKeys.value.length > 0
    ) {
      selection.selectBoard(orderedBoardKeys.value[0] as never)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    id="canvas"
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
      <section v-if="activeBoard" class="canvas-board">
        <Teleport to="head">
          <component :is="'style'">{{ boardCss }}</component>
        </Teleport>
        <div
          class="canvas-board__root"
          :class="boardClassName"
          :style="boardRootStyle"
          :data-board-id="activeBoardKey"
          :data-selection-id="activeBoardKey"
          data-selection-kind="board"
        >
          <CanvasNode
            v-for="rootId in boardRootIds"
            :key="rootId"
            :workspace="workspace"
            :node-id="rootId"
            :initial-theme-id="boardThemeId"
            :active-state="boardActiveState"
          />
        </div>
      </section>
    </div>
    <CanvasTracking
      v-if="!isInPreviewMode"
      :subscribe-transform="subscribeTransform"
    />
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
  align-items: flex-start;
  justify-content: center;
  will-change: transform;
}
.canvas-board {
  position: relative;
}
</style>
