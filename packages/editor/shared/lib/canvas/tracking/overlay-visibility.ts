import { isThemeBoard } from "@seldon/core/workspace/model/components"

import type { Board } from "@seldon/core/workspace/types"

/** Minimal insertion hover shape the sibling-gap check needs. */
export interface InsertHoverLike {
  objectType: "node" | "board"
  lastChildNodeBeforeCursor: string | null
}

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
 * A between-siblings gap is highlighted by the paired sibling outlines, so the
 * single full-node hover box is suppressed to avoid a redundant box over one of
 * the siblings. Insert-into-node hovers (no boundary child) keep the full-node
 * accent box.
 */
export function getIsSiblingGap(activeTool: string, hoverState: InsertHoverLike | null): boolean {
  return (
    activeTool === "component" &&
    hoverState?.objectType === "node" &&
    hoverState?.lastChildNodeBeforeCursor != null
  )
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
