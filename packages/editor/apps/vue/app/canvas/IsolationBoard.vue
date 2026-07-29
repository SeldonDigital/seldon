<script setup lang="ts">
import { useBoardStateStore } from "@app/canvas/board-state-store"
import { ValueType, Workspace, getCssFromProperties, getNodeProperties } from "@app/core"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useResolvedInterfaceMode } from "@app/editor/use-resolved-interface-mode"
import { useSelectionStore } from "@app/workspace/selection-store"
import { getVisibleVariantRootIds } from "@seldon/editor/lib/canvas/get-visible-variant-root-ids"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

import CanvasNode from "./CanvasNode.vue"

import type { FontFamilyValue } from "@seldon/core/properties/values/typography/font/font-family"
import type { Board } from "@seldon/core/workspace/types"
import type { CSSProperties } from "vue"

// `variantRootIds` overrides the rendered variants (isolation dependency
// boards). Omit it for the anchored board, which shows its selected variant.
// `boardLabel` is the caption from the shared isolation gallery groups.
const props = defineProps<{
  workspace: Workspace
  board: Board
  boardLabel: string
  variantRootIds?: string[]
}>()

const boardState = useBoardStateStore()
const config = useEditorConfigStore()
const selection = useSelectionStore()
const { isolatedView } = storeToRefs(config)
const { selectedNodeRootId } = storeToRefs(selection)

const PRIMARY_FONT_FAMILY = {
  type: ValueType.THEME_CATEGORICAL,
  value: "@fontFamily.primary",
} as unknown as FontFamilyValue

const resolvedMode = useResolvedInterfaceMode()

const boardKey = computed(() => getComponentKey(props.board))
const boardClassName = computed(() => `board-${boardKey.value}`)

// The canvas is pinned to the default (light) theme, so its swatch variables
// never invert. Pick the interface-mode foreground here so the chrome caption
// follows the editor mode: dark text in light mode, light text in dark mode.
const labelStyle = computed<CSSProperties>(() => ({
  color:
    resolvedMode.value === "dark" ? "var(--sdn-swatch-offWhite)" : "var(--sdn-swatch-offBlack)",
}))

const boardProperties = computed(() => getNodeProperties(props.board, props.workspace))

const boardTheme = computed(() =>
  workspaceThemeService.getObjectTheme(props.board, props.workspace),
)

const boardThemeId = computed(() =>
  workspaceThemeService.getObjectThemeId(props.board, props.workspace),
)

const boardRootIds = computed(() =>
  props.variantRootIds
    ? props.variantRootIds
    : getVisibleVariantRootIds(props.board, {
        isolatedView: isolatedView.value,
        selectedNodeRootId: selectedNodeRootId.value,
      }),
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

const boardActiveState = computed(() => boardState.getActiveState(boardKey.value))
</script>

<template>
  <section class="canvas-board">
    <Teleport to="head">
      <component :is="'style'">{{ boardCss }}</component>
    </Teleport>
    <div class="isolation-board-label" :style="labelStyle">
      {{ boardLabel }}
    </div>
    <div
      class="canvas-board__root"
      :class="boardClassName"
      :style="boardRootStyle"
      :data-board-id="boardKey"
      :data-selection-id="boardKey"
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
</template>

<style scoped>
.canvas-board {
  position: relative;
}

/*
 * Board name caption above each board in the isolation gallery. It matches the
 * objects sidebar text and sits outside the themed board root. The canvas pins
 * the default theme, so the interface-mode text color is applied inline.
 */
.isolation-board-label {
  margin-bottom: var(--sdn-margins-tight);
  font-family: var(--sdn-font-family-primary), system-ui, sans-serif;
  font-size: var(--sdn-font-size-xsmall);
  font-weight: var(--sdn-font-weight-normal);
  line-height: 1.2;
}
</style>
