"use client"

import type { CSSProperties } from "react"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { getNodeOrientation } from "@lib/workspace/get-node-orientation"
import { Frame } from "@seldon/components/frames/Frame"
import { getHtmlElementByNodeId } from "../../../canvas/helpers/get-html-element-by-node-id"
import {
  pickOutlineColorsFromSurface,
  resolveOutlineSurfaceForNode,
} from "../../helpers/resolve-outline-surface"

/** Seldon accent token used for the edge touching the insertion gap. */
const ACCENT_COLOR = "var(--sdn-swatch-accent)"

/** Canvas overlay stroke width (px), matching the wireframe outlines. */
const BORDER_PX = 1

type AccentSide = "right" | "left" | "top" | "bottom"

type SiblingBox = {
  top: number
  left: number
  width: number
  height: number
  accentSide: AccentSide
  contrast: string
}

/**
 * Outlines the two sibling nodes that touch an insertion gap. Each sibling gets
 * the dashed wireframe in the high-contrast surface color, with only the edge
 * facing the gap recolored to the accent. For a horizontal container that is the
 * left sibling's right edge and the right sibling's left edge; for a vertical
 * container it is the top sibling's bottom edge and the bottom sibling's top
 * edge.
 *
 * Renders nothing unless the hover is a between-siblings gap, which the parent
 * `InsertTracking` and `CanvasTracking` rely on to swap the single full-node
 * hover box for these paired outlines.
 */
export function InsertGapSiblings() {
  const { hoverState } = useCanvasHoverState()
  const { workspace } = useWorkspace()

  if (!hoverState || hoverState.objectType !== "node") return null

  const { objectId, lastChildNodeBeforeCursor } = hoverState
  if (!lastChildNodeBeforeCursor) return null

  const canvasElement = document.getElementById("canvas")
  const boundaryElement = getHtmlElementByNodeId(lastChildNodeBeforeCursor)
  if (!canvasElement || !boundaryElement) return null

  const nextElement = boundaryElement.nextElementSibling as HTMLElement | null
  const orientation = getNodeOrientation(objectId, workspace)
  const canvasRect = canvasElement.getBoundingClientRect()

  const fallbackContrast = pickOutlineColorsFromSurface(
    resolveOutlineSurfaceForNode(objectId, workspace),
  ).hover

  const contrastFor = (element: HTMLElement): string => {
    const id =
      element.getAttribute("data-canvas-node-id") ??
      element.getAttribute("data-node-id")
    if (!id) return fallbackContrast
    return pickOutlineColorsFromSurface(
      resolveOutlineSurfaceForNode(id, workspace),
    ).hover
  }

  const toBox = (element: HTMLElement, accentSide: AccentSide): SiblingBox => {
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top - canvasRect.top - BORDER_PX,
      left: rect.left - canvasRect.left - BORDER_PX,
      width: rect.width + BORDER_PX,
      height: rect.height + BORDER_PX,
      accentSide,
      contrast: contrastFor(element),
    }
  }

  const boxes: SiblingBox[] = []
  if (orientation === "horizontal") {
    boxes.push(toBox(boundaryElement, "right"))
    if (nextElement) boxes.push(toBox(nextElement, "left"))
  } else {
    boxes.push(toBox(boundaryElement, "bottom"))
    if (nextElement) boxes.push(toBox(nextElement, "top"))
  }

  return (
    <>
      {boxes.map((box, index) => {
        const style: CSSProperties = {
          position: "absolute",
          pointerEvents: "none",
          zIndex: 2,
          boxSizing: "border-box",
          borderStyle: "dashed",
          borderWidth: BORDER_PX,
          borderColor: box.contrast,
          top: `${box.top}px`,
          left: `${box.left}px`,
          width: `${box.width}px`,
          height: `${box.height}px`,
          ...(box.accentSide === "right" && { borderRightColor: ACCENT_COLOR }),
          ...(box.accentSide === "left" && { borderLeftColor: ACCENT_COLOR }),
          ...(box.accentSide === "top" && { borderTopColor: ACCENT_COLOR }),
          ...(box.accentSide === "bottom" && {
            borderBottomColor: ACCENT_COLOR,
          }),
        }
        return <Frame key={`${box.accentSide}-${index}`} style={style} />
      })}
    </>
  )
}
