"use client"

import type { CSSProperties } from "react"
import { useHoveredId } from "@lib/workspace/use-object-hover"
import { useSelectedId } from "@lib/workspace/selection-target"
import { useCanvasOverlayStore } from "../../../canvas/use-canvas-overlay-store"
import type { NodeRect } from "../../hooks/use-node-rects-store"
import {
  getSelectionMode,
  getSelectionOutlineStyle,
} from "../../utils/canvas-outline-modes"

function outlineStyle(
  rect: NodeRect,
  variant: "selection" | "hover",
): CSSProperties {
  const box = getSelectionMode(rect)
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
export function CanvasSelectionOutline() {
  const rect = useCanvasOverlayStore((state) => state.selectionRect)
  if (!rect) return null
  return <div style={outlineStyle(rect, "selection")} />
}

/** Dashed border around the hovered object (any kind). */
export function CanvasHoverOutline() {
  const rect = useCanvasOverlayStore((state) => state.hoverRect)
  const hoveredId = useHoveredId()
  const selectedId = useSelectedId()
  // Suppress the hover outline when it coincides with the selection outline.
  if (!rect || (hoveredId !== null && hoveredId === selectedId)) return null
  return <div style={outlineStyle(rect, "hover")} />
}
