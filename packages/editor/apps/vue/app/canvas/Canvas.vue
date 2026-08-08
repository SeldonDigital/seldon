<script setup lang="ts">
import { useBoardStateStore } from "@app/canvas/board-state-store"
import { useActiveBoard } from "@app/canvas/use-active-board"
import { useCanvasTracking } from "@app/canvas/use-canvas-tracking"
import { usePanZoom } from "@app/canvas/use-pan-zoom"
import { ValueType, Workspace, getCssFromProperties, getNodeProperties } from "@app/core"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import CanvasOverlays from "@app/overlays/canvas/CanvasOverlays.vue"
import { useSelectionStore } from "@app/workspace/selection-store"
import { getIsolationCanvasGroups } from "@seldon/editor/lib/canvas/get-isolation-canvas-groups"
import { getVisibleVariantRootIds } from "@seldon/editor/lib/canvas/get-visible-variant-root-ids"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import { isFontCollectionBoard } from "@seldon/core/workspace/model/components"
import { boardOrderService } from "@seldon/core/workspace/services"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

import CanvasNode from "./CanvasNode.vue"
import FontSpecimenCanvas from "./FontSpecimenCanvas.vue"
import IsolationBoard from "./IsolationBoard.vue"
import ZoomControls from "./ZoomControls.vue"

import type { FontFamilyValue } from "@seldon/core/properties/values/typography/font/font-family"
import type { Board } from "@seldon/core/workspace/types"
import type { CSSProperties } from "vue"

const props = defineProps<{ workspace: Workspace }>()

const boardState = useBoardStateStore()
const config = useEditorConfigStore()
const selection = useSelectionStore()
const { activeBoard, activeBoardKey } = useActiveBoard()
const {
  onCanvasClick,
  onCanvasDblClick,
  onCanvasMouseDown,
  onCanvasPointerMove,
  onCanvasPointerLeave,
} = useCanvasTracking()

const { isolatedView, isolatedBoardKey, isolatedVariantRootId } = storeToRefs(config)
const {
  selectedBoardId,
  selectedNodeId,
  selectedNodeRootId,
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
  resetView,
} = usePanZoom(scrollEl)

const contentStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  transformOrigin: "0 0",
}))

// What the canvas is showing. Isolation names itself here, so entering, leaving,
// and isolating another variant of the same board each count as a change while
// selecting a dependency board inside the gallery does not. Mirrors React.
const canvasViewKey = computed(() =>
  isolatedView.value
    ? `isolated:${isolatedBoardKey.value}:${isolatedVariantRootId.value ?? ""}`
    : activeBoardKey.value,
)

// The viewport returns home whenever the canvas shows something else. A gallery
// lays out nothing like the board it replaces, so carrying the old pan and zoom
// across would leave the canvas parked away from what just appeared.
watch(canvasViewKey, () => resetView())

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

const boardClassName = computed(() => (activeBoardKey.value ? `board-${activeBoardKey.value}` : ""))

const boardProperties = computed(() =>
  activeBoard.value ? getNodeProperties(activeBoard.value, props.workspace) : undefined,
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
  activeBoard.value
    ? getVisibleVariantRootIds(activeBoard.value, {
        isolatedView: isolatedView.value,
        selectedNodeRootId: selectedNodeRootId.value,
      })
    : [],
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
    ? resolveFontFamily({
        fontFamily: PRIMARY_FONT_FAMILY,
        theme: boardTheme.value,
      })?.value
    : undefined
  const base: CSSProperties = { position: "static" }
  return family ? { ...base, fontFamily: family } : base
})

const boardActiveState = computed(() =>
  activeBoardKey.value ? boardState.getActiveState(activeBoardKey.value) : undefined,
)

// Isolation gallery: the anchored board plus its used dependency boards,
// grouped by component level (levels stack vertically, boards within a level
// sit in a row). Mirrors the React IsolationBoards.
const isolatedBoard = computed<Board | null>(() => {
  const key = isolatedBoardKey.value
  return key ? (props.workspace.boards[key] ?? null) : null
})

const showIsolationGallery = computed(() => isolatedView.value && isolatedBoard.value !== null)

// A font-collection board renders a single specimen for the selected family
// instead of a node tree, so it takes its own canvas branch.
const showFontSpecimen = computed(
  () => activeBoard.value !== null && isFontCollectionBoard(activeBoard.value),
)

const isolationRows = computed(() => {
  const board = isolatedBoard.value
  if (!board) return []
  const boards = boardOrderService.getBoards(props.workspace)
  const groups = getIsolationCanvasGroups(
    board,
    isolatedVariantRootId.value,
    props.workspace,
    boards,
  )
  return groups.map((group) => ({
    level: group.level,
    boards: group.items.map((item) => ({
      key: getComponentKey(item.board),
      board: item.board,
      label: item.label,
      // The anchored board renders only the variant frozen on enable, so
      // selecting other components never brings its other variants back.
      variantRootIds: item.isIsolatedBoard
        ? isolatedVariantRootId.value
          ? [isolatedVariantRootId.value]
          : item.variantRootIds
        : item.variantRootIds,
    })),
  }))
})

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
      @dblclick="onCanvasDblClick"
      @mousedown="onCanvasMouseDown"
      @pointermove="onCanvasPointerMove"
    >
      <div v-if="showIsolationGallery" class="isolation-gallery">
        <div v-for="row in isolationRows" :key="row.level" class="isolation-row">
          <IsolationBoard
            v-for="item in row.boards"
            :key="item.key"
            :workspace="workspace"
            :board="item.board"
            :board-label="item.label"
            :variant-root-ids="item.variantRootIds"
          />
        </div>
      </div>
      <FontSpecimenCanvas
        v-else-if="showFontSpecimen && activeBoard"
        :workspace="workspace"
        :board="activeBoard"
      />
      <section v-else-if="activeBoard" class="canvas-board">
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
    <CanvasOverlays :subscribe-transform="subscribeTransform" />
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
  /* Default (arrow) rather than auto so canvas nodes inheriting this cursor
     never fall back to the text I-beam over text content. */
  cursor: default;
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
.isolation-gallery {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4rem;
}
.isolation-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 2rem;
}
</style>
