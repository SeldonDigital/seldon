import { isThemeBoard } from "@seldon/core/workspace/model/components"

import type { Board } from "@seldon/core/workspace/types"

/** Explicit wireframe mode. Auto behavior is handled by the caller's tool. */
export function getShowWireframes(wireframeMode: string): boolean {
  return wireframeMode === "on"
}

/**
 * Theme boards are previews, not an editable node tree, so they show no
 * selection or hover outline on the canvas.
 */
export function getActiveBoardIsTheme(activeBoard: Board | null): boolean {
  return activeBoard ? isThemeBoard(activeBoard) : false
}

/**
 * Suppress the hover outline only when it coincides with the selection outline
 * in the same variant-root column. A child id shared across columns must still
 * highlight the hovered copy when a different copy is selected.
 */
export function getHoverCoincidesWithSelection(input: {
  hoveredId: string | null
  hoveredRootId: string | null
  selectedId: string | null
  selectedRootId: string | null
}): boolean {
  return (
    input.hoveredId !== null &&
    input.hoveredId === input.selectedId &&
    input.hoveredRootId === input.selectedRootId
  )
}
