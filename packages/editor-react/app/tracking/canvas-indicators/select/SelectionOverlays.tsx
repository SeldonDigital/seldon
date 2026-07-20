"use client"

import { OutlineBox } from "@app/overlays"
import type { CSSProperties } from "react"
import {
  useHoveredId,
  useHoveredRootId,
} from "@app/workspace/hooks/use-object-hover"
import { useSelectedNodeRootId } from "@app/workspace/hooks/use-selection"
import { useCanvasOverlayStore } from "../../../canvas/hooks/use-canvas-overlay-store"
import type { NodeRect } from "../../hooks/use-node-rects-store"
import { useSelectedId } from "@app/workspace/selection-target"
import {
  getSelectionMode,
  getSelectionOutlineStyle,
  getWireframeMode,
} from "../../helpers/canvas-outline-modes"

function outlineStyle(
  rect: NodeRect,
  variant: "selection" | "hover",
  wireframe: boolean,
  borderColor?: string,
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
    ...getSelectionOutlineStyle(variant, borderColor),
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
  const outlineColors = useCanvasOverlayStore(
    (state) => state.selectionOutlineColors,
  )
  if (!rect) return null
  return (
    <OutlineBox
      style={outlineStyle(
        rect,
        "selection",
        wireframe,
        outlineColors?.selection,
      )}
    />
  )
}

/** Dashed border around the hovered object (any kind). */
export function CanvasHoverOutline({
  wireframe = false,
}: {
  wireframe?: boolean
}) {
  const rect = useCanvasOverlayStore((state) => state.hoverRect)
  const outlineColors = useCanvasOverlayStore(
    (state) => state.hoverOutlineColors,
  )
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
  return (
    <OutlineBox
      style={outlineStyle(rect, "hover", wireframe, outlineColors?.hover)}
    />
  )
}
