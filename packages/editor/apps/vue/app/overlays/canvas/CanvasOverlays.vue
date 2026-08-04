<script setup lang="ts">
import { useActiveBoard } from "@app/canvas/use-active-board"
import { useCanvasOverlays } from "@app/canvas/use-canvas-overlays"
import { useSharedStore } from "@app/canvas/use-shared-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useToolStore } from "@app/editor/tool-store"
import { useTrackedVisibleNodes } from "@app/overlays/hooks/use-node-rects"
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

import RefConnector from "./ref-badges/RefConnector.vue"
import TokenConnector from "./token-badges/TokenConnector.vue"
import HoverOverlay from "./select/HoverOverlay.vue"
import NodeWireframe from "./select/NodeWireframe.vue"
import SelectionOverlay from "./select/SelectionOverlay.vue"

const props = defineProps<{
  subscribeTransform: (listener: () => void) => () => void
}>()

const config = useEditorConfigStore()
const tool = useToolStore()
const { activeBoard } = useActiveBoard()
const selection = useSelectionStore()
const hover = useObjectHoverStore()

const {
  wireframeMode,
  showSelection,
  showRefBadges,
  showLayoutBadges,
  showSpaceBadges,
  showDimensionBadges,
  showAppearanceBadges,
  showTypographyBadges,
  showEffectsBadges,
} = storeToRefs(config)
const { activeTool } = storeToRefs(tool)
const { selectedNodeId, selectedNodeRootId } = storeToRefs(selection)
const { hoveredId, hoveredRootId } = storeToRefs(hover)

const { selectionRect, hoverRect, selectionColors, hoverColors } = useCanvasOverlays(
  props.subscribeTransform,
)
const { visibleNodeIds } = useTrackedVisibleNodes()
const isTransforming = useSharedStore(remeasureStore, (s) => s.isTransforming)

const showWireframes = computed(() => getShowWireframes(wireframeMode.value))
const activeBoardIsTheme = computed(() => getActiveBoardIsTheme(activeBoard.value))

const hoverCoincidesWithSelection = computed(() =>
  getHoverCoincidesWithSelection({
    hoveredId: hoveredId.value,
    hoveredRootId: hoveredRootId.value,
    selectedId: selectedNodeId.value,
    selectedRootId: selectedNodeRootId.value,
  }),
)

const showWireframeNodes = computed(
  () => activeTool.value === "select" && showWireframes.value && !isTransforming.value,
)
const showSelectionOverlay = computed(
  () => showSelection.value && activeTool.value === "select" && !activeBoardIsTheme.value,
)
const showSelectHover = computed(
  () =>
    showSelection.value &&
    activeTool.value === "select" &&
    !activeBoardIsTheme.value &&
    !hoverCoincidesWithSelection.value,
)
const showInsertHover = computed(() => activeTool.value === "component")

// Badges stay drawn through a pan or zoom, unlike the boxes above, which hide
// until it settles. Hiding them would take the open card with them, and the badges
// sit in the gutter rather than over the canvas, so they have somewhere to stay. The
// connector view-model re-measures its own nodes per frame to keep up. Theme boards
// have no node tree to reference.
const drawRefBadges = computed(() => showRefBadges.value && !activeBoardIsTheme.value)

// Token badges draw when any group is enabled. Like the reference badges, they hang in the
// gutter and stay drawn through a pan, and a theme board has no node tree to anchor to.
const anyTokenGroupEnabled = computed(
  () =>
    showLayoutBadges.value ||
    showSpaceBadges.value ||
    showDimensionBadges.value ||
    showAppearanceBadges.value ||
    showTypographyBadges.value ||
    showEffectsBadges.value,
)
const drawTokenBadges = computed(() => anyTokenGroupEnabled.value && !activeBoardIsTheme.value)
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
  <HoverOverlay v-else-if="showInsertHover" :rect="hoverRect" :colors="hoverColors" />
  <RefConnector v-if="drawRefBadges" />
  <TokenConnector v-if="drawTokenBadges" />
</template>
