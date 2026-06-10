"use client"

import type { CSSProperties } from "react"
import {
  useHoveredId,
  useHoveredRootId,
} from "@lib/workspace/hooks/use-object-hover"
import { useSelectedNodeRootId } from "@lib/workspace/hooks/use-selection"
import { useCanvasOverlayStore } from "../../../canvas/hooks/use-canvas-overlay-store"
import type { NodeRect } from "../../hooks/use-node-rects-store"
import { useSelectedId } from "@lib/workspace/selection-target"
import { CanvasOutline } from "@seldon/components/custom-components"
import {
  getSelectionMode,
  getSelectionOutlineStyle,
  getWireframeMode,
} from "../../helpers/canvas-outline-modes"

function outlineStyle(
  rect: NodeRect,
  variant: "selection" | "hover",
  wireframe: boolean,
): CSSProperties {
  // In wireframe mode the outline hugs the node border to align with the
  // surrounding wireframe boxes; otherwise it sits padded off the node.
  const box = wireframe ? getWireframeMode(rect) : getSelectionMode(rect)
  return {
    position: "absolute",
    pointerEvents: "none",
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    ...getSelectionOutlineStyle(variant),
    borderWidth: box.borderWidth,
    zIndex: 1,
  }
}

/** Dashed border around the selected object (any kind). */
export function CanvasSelectionOutline({
  wireframe = false,
}: {
  wireframe?: boolean
}) {
  const rect = useCanvasOverlayStore((state) => state.selectionRect)
  if (!rect) return null
  return <CanvasOutline style={outlineStyle(rect, "selection", wireframe)} />
}

/** Dashed border around the hovered object (any kind). */
export function CanvasHoverOutline({
  wireframe = false,
}: {
  wireframe?: boolean
}) {
  const rect = useCanvasOverlayStore((state) => state.hoverRect)
  const hoveredId = useHoveredId()
  const hoveredRootId = useHoveredRootId()
  const selectedId = useSelectedId()
  const selectedRootId = useSelectedNodeRootId()
  // Suppress the hover outline only when it coincides with the selection
  // outline in the same variant-root column. A child id shared across columns
  // must still highlight the hovered copy when a different copy is selected.
  const coincidesWithSelection =
    hoveredId !== null &&
    hoveredId === selectedId &&
    hoveredRootId === selectedRootId
  if (!rect || coincidesWithSelection) return null
  return <CanvasOutline style={outlineStyle(rect, "hover", wireframe)} />
}
