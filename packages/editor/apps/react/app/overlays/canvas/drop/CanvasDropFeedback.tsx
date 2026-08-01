"use client"

import { IndicatorLine, OutlineBox } from "@app/overlays/primitives"
import { Frame } from "@seldon/components/frames/Frame"
import { getSelectionOutlineStyle } from "@seldon/editor/lib/canvas/overlay/outline-style"
import { useMemo } from "react"

import { useDropFeedback } from "./hooks/use-drop-feedback"

import type { BoundarySide } from "./hooks/use-drop-feedback"
import type { CanvasDropSlot } from "@seldon/editor/lib/canvas/drag/drop-slot"
import type { CSSProperties } from "react"

/** Seldon accent token, marking every part of a drop. */
const ACCENT_COLOR = "var(--sdn-swatch-accent)"

/** Canvas overlay stroke width (px), matching the wireframe outlines. */
const BORDER_PX = 1

/** How solid the boundary mark paints over the content beneath it. */
const MARK_OPACITY = 0.5

const overlayLayer: CSSProperties = {
  position: "absolute",
  pointerEvents: "none",
  zIndex: 10,
}

const outlineLayer: CSSProperties = {
  position: "absolute",
  pointerEvents: "none",
  zIndex: 2,
}

const markLineStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundColor: ACCENT_COLOR,
  opacity: MARK_OPACITY,
  borderRadius: "var(--sdn-corners-tight)",
}

/**
 * Where a drop would land, drawn the same way by every tool that puts a node in
 * place: the insert tool and a canvas reorder drag.
 *
 * The boundary carries a line, widening to fill the whole gap between two
 * siblings that have one. A drop between siblings frames the pair and accents the
 * edge each turns to the boundary. A drop on a container's own edge frames the
 * container instead, since there is no pair to point at.
 */
export function CanvasDropFeedback({ slot }: { slot: CanvasDropSlot }) {
  const geometry = useDropFeedback(slot)

  const markStyle = useMemo<CSSProperties>(() => {
    if (!geometry) return overlayLayer

    return {
      ...overlayLayer,
      top: `${geometry.mark.top}px`,
      left: `${geometry.mark.left}px`,
      width: `${geometry.mark.width}px`,
      height: `${geometry.mark.height}px`,
    }
  }, [geometry])

  const containerStyle = useMemo<CSSProperties | null>(() => {
    if (!geometry?.container) return null

    return {
      ...outlineLayer,
      top: `${geometry.container.top - BORDER_PX}px`,
      left: `${geometry.container.left - BORDER_PX}px`,
      width: `${geometry.container.width + BORDER_PX}px`,
      height: `${geometry.container.height + BORDER_PX}px`,
      ...getSelectionOutlineStyle("hover", ACCENT_COLOR, BORDER_PX),
    }
  }, [geometry])

  const siblingStyles = useMemo<CSSProperties[]>(() => {
    if (!geometry) return []

    return geometry.siblings.map((sibling) => ({
      ...outlineLayer,
      top: `${sibling.top - BORDER_PX}px`,
      left: `${sibling.left - BORDER_PX}px`,
      width: `${sibling.width + BORDER_PX}px`,
      height: `${sibling.height + BORDER_PX}px`,
      ...getSelectionOutlineStyle("hover", sibling.contrast, BORDER_PX),
      ...getBoundaryEdgeStyle(sibling.boundarySide),
    }))
  }, [geometry])

  if (!geometry) return null

  const container = containerStyle ? <OutlineBox style={containerStyle} /> : null
  const siblings = siblingStyles.map((style, index) => <OutlineBox key={index} style={style} />)

  return (
    <>
      {container}
      {siblings}
      <Frame style={markStyle}>
        <IndicatorLine style={markLineStyle} />
      </Frame>
    </>
  )
}

/** Recolors only the edge a sibling turns to the drop boundary. */
function getBoundaryEdgeStyle(side: BoundarySide): CSSProperties {
  if (side === "right") return { borderRightColor: ACCENT_COLOR }
  if (side === "left") return { borderLeftColor: ACCENT_COLOR }
  if (side === "top") return { borderTopColor: ACCENT_COLOR }

  return { borderBottomColor: ACCENT_COLOR }
}
