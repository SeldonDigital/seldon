"use client"

import { IndicatorLine, OutlineBox } from "@app/overlays/primitives"
import { rectsEqual, toCanvasRect } from "@seldon/editor/lib/canvas/overlay/measure"
import { useEffect, useState } from "react"

import type { CanvasDropTarget } from "@seldon/editor/lib/canvas/drag/canvas-placement"
import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { CSSProperties } from "react"

const INDICATOR_COLOR = "var(--sdn-swatch-primary)"

/** Line thickness in px. Thicker than a sidebar row's line, to read over content. */
const LINE_THICKNESS = 2

/**
 * Where a canvas drag would land. An edge placement draws a line across the
 * target's edge, on the axis of the list it sits in, and `inside` outlines the
 * whole target, the way a sidebar row does when a drop would nest into it.
 */
export function CanvasDropIndicator({ dropTarget }: { dropTarget: CanvasDropTarget }) {
  const rect = useLiveRect(dropTarget.element)

  if (!rect) return null

  if (dropTarget.placement === "inside") {
    const outlineStyle: CSSProperties = {
      position: "absolute",
      top: rect.top,
      left: rect.left,
      height: rect.height,
      width: rect.width,
      zIndex: 20,
      pointerEvents: "none",
      borderWidth: LINE_THICKNESS,
      borderStyle: "solid",
      borderColor: INDICATOR_COLOR,
      borderRadius: "var(--sdn-corners-small)",
      boxSizing: "border-box",
    }

    return <OutlineBox style={outlineStyle} />
  }

  const leading = dropTarget.placement === "before"
  const horizontal = dropTarget.axis === "horizontal"
  const offset = LINE_THICKNESS / 2

  const lineStyle: CSSProperties = {
    position: "absolute",
    top: horizontal ? rect.top : (leading ? rect.top : rect.top + rect.height) - offset,
    left: horizontal ? (leading ? rect.left : rect.left + rect.width) - offset : rect.left,
    height: horizontal ? rect.height : LINE_THICKNESS,
    width: horizontal ? LINE_THICKNESS : rect.width,
    zIndex: 20,
    pointerEvents: "none",
    backgroundColor: INDICATOR_COLOR,
  }

  return <IndicatorLine style={lineStyle} />
}

/**
 * The target's canvas rect, re-measured every frame. A drag writes a preview and
 * the reorder glides to it, so the edge this line marks keeps moving after the
 * target is chosen. The tracked rects are only refreshed once the animation
 * settles, which is too late for a line the cursor is aiming with.
 */
function useLiveRect(element: HTMLElement): NodeRect | null {
  const [rect, setRect] = useState<NodeRect | null>(() =>
    toCanvasRect(element.getBoundingClientRect()),
  )

  useEffect(() => {
    let frame = 0

    const measure = () => {
      const next = toCanvasRect(element.getBoundingClientRect())

      setRect((current) => (rectsEqual(current, next) ? current : next))
      frame = requestAnimationFrame(measure)
    }

    frame = requestAnimationFrame(measure)

    return () => cancelAnimationFrame(frame)
  }, [element])

  return rect
}
