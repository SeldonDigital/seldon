<script setup lang="ts">
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useToolStore } from "@app/editor/tool-store"
import { useActiveBoard } from "@app/canvas/use-active-board"
import { useObjectHoverStore } from "@app/workspace/object-hover-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { remeasureStore } from "@seldon/editor/lib/canvas/remeasure/remeasure-store"
import {
  getActiveBoardIsTheme,
  getHoverCoincidesWithSelection,
  getShowWireframes,
} from "@seldon/editor/lib/canvas/tracking/overlay-visibility"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import HoverOverlay from "./HoverOverlay.vue"
import NodeWireframe from "./NodeWireframe.vue"
import SelectionOverlay from "./SelectionOverlay.vue"
import { useCanvasOverlays } from "./use-canvas-overlays"
import { useTrackedVisibleNodes } from "./use-node-rects"
import { useSharedStore } from "./use-shared-store"

const props = defineProps<{
  subscribeTransform: (listener: () => void) => () => void
}>()

const config = useEditorConfigStore()
const tool = useToolStore()
const { activeBoard } = useActiveBoard()
const selection = useSelectionStore()
const hover = useObjectHoverStore()

const { wireframeMode, showSelection } = storeToRefs(config)
const { activeTool } = storeToRefs(tool)
const { selectedNodeId, selectedNodeRootId } = storeToRefs(selection)
const { hoveredId, hoveredRootId } = storeToRefs(hover)

const { selectionRect, hoverRect, selectionColors, hoverColors } =
  useCanvasOverlays(props.subscribeTransform)
const { visibleNodeIds } = useTrackedVisibleNodes()
const isTransforming = useSharedStore(remeasureStore, (s) => s.isTransforming)

const showWireframes = computed(() => getShowWireframes(wireframeMode.value))
const activeBoardIsTheme = computed(() =>
  getActiveBoardIsTheme(activeBoard.value),
)

const hoverCoincidesWithSelection = computed(() =>
  getHoverCoincidesWithSelection({
    hoveredId: hoveredId.value,
    hoveredRootId: hoveredRootId.value,
    selectedId: selectedNodeId.value,
    selectedRootId: selectedNodeRootId.value,
  }),
)

const showWireframeNodes = computed(
  () =>
    activeTool.value === "select" &&
    showWireframes.value &&
    !isTransforming.value,
)
const showSelectionOverlay = computed(
  () =>
    showSelection.value &&
    activeTool.value === "select" &&
    !activeBoardIsTheme.value,
)
const showSelectHover = computed(
  () =>
    showSelection.value &&
    activeTool.value === "select" &&
    !activeBoardIsTheme.value &&
    !hoverCoincidesWithSelection.value,
)
const showInsertHover = computed(() => activeTool.value === "component")
</script>

<template>
  <template v-if="showWireframeNodes">
    <NodeWireframe
      v-for="id in visibleNodeIds"
      :key="id"
      :node-id="id"
      :is-selected="selectedNodeId === id"
    />
  </template>
  <SelectionOverlay
    v-if="showSelectionOverlay"
    :rect="selectionRect"
    :colors="selectionColors"
    :wireframe="showWireframes"
  />
  <HoverOverlay
    v-if="showSelectHover"
    :rect="hoverRect"
    :colors="hoverColors"
    :wireframe="showWireframes"
  />
  <HoverOverlay
    v-else-if="showInsertHover"
    :rect="hoverRect"
    :colors="hoverColors"
  />
</template>
