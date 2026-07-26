"use client"

import { OutlineBox } from "@app/overlays"
import {
  useHoveredId,
  useHoveredRootId,
} from "@app/workspace/hooks/use-object-hover"
import { useSelectedNodeRootId } from "@app/workspace/hooks/use-selection"
import { useSelectedId } from "@app/workspace/selection-target"
import { getHoverCoincidesWithSelection } from "@seldon/editor/lib/canvas/tracking/overlay-visibility"

import { useCanvasOverlayStore } from "../../../canvas/hooks/use-canvas-overlays"
import { outlineBoxStyle } from "./outline-box-style"

/** Dashed border around the hovered object (any kind). */
export function HoverOverlay({ wireframe = false }: { wireframe?: boolean }) {
  const rect = useCanvasOverlayStore((state) => state.hoverRect)
  const outlineColors = useCanvasOverlayStore(
    (state) => state.hoverOutlineColors,
  )
  const hoveredId = useHoveredId()
  const hoveredRootId = useHoveredRootId()
  const selectedId = useSelectedId()
  const selectedRootId = useSelectedNodeRootId()
  // Suppress the hover outline only when it coincides with the selection outline
  // in the same variant-root column. A child id shared across columns must still
  // highlight the hovered copy when a different copy is selected.
  const coincidesWithSelection = getHoverCoincidesWithSelection({
    hoveredId,
    hoveredRootId,
    selectedId,
    selectedRootId,
  })
  if (!rect || coincidesWithSelection) return null
  return (
    <OutlineBox
      style={outlineBoxStyle(rect, "hover", wireframe, outlineColors?.hover)}
    />
  )
}
