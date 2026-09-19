<script setup lang="ts">
import { Workspace } from "@app/core"
import { captureBoardStore } from "@seldon/editor/lib/canvas/capture/capture-board"
import { getComponent } from "@seldon/editor/lib/workspace/workspace-accessors"
import { computed } from "vue"

import { isFontCollectionBoard } from "@seldon/core/workspace/model/components"

import FontSpecimenCanvas from "./FontSpecimenCanvas.vue"
import IsolationBoard from "./IsolationBoard.vue"
import { useSharedStore } from "./use-shared-store"

import type { CSSProperties } from "vue"

// The surface a capture rasterizes a board from when the canvas is showing a
// different one. It holds nothing until `startCaptureBoard` names a board, and
// empties again once the capture has its JPEG, so the user's selection, active
// board, pan, and zoom stay exactly as they were. Mount it once in the editor
// page, outside the canvas.
const props = defineProps<{ workspace: Workspace }>()

/**
 * How far off the viewport the surface sits. Canvas geometry, not a style value,
 * so it stays a plain number. Far enough that no board of any size reaches back
 * into view.
 */
const OFFSET_PX = -100_000

// Fixed rather than absolute so no ancestor's scroll or layout moves it, and the
// board inside lays out and measures normally at its own size. It sits outside
// the canvas transform, so canvas pan and zoom never reach it.
const surfaceStyle: CSSProperties = {
  position: "fixed",
  top: "0",
  left: `${OFFSET_PX}px`,
  pointerEvents: "none",
}

const boardKey = useSharedStore(captureBoardStore, (state) => state.boardKey)

const board = computed(() =>
  boardKey.value ? getComponent(props.workspace, boardKey.value) : undefined,
)

const showFontSpecimen = computed(() => Boolean(board.value && isFontCollectionBoard(board.value)))
</script>

<template>
  <div :style="surfaceStyle" data-capture-board="true" aria-hidden="true">
    <FontSpecimenCanvas v-if="showFontSpecimen && board" :workspace="workspace" :board="board" />
    <IsolationBoard v-else-if="board" :workspace="workspace" :board="board" />
  </div>
</template>
