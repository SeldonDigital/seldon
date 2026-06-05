"use client"

import { useEffect, useRef } from "react"
import { useTransformContext } from "react-zoom-pan-pinch"
import { useHoveredId } from "@lib/workspace/hooks/use-object-hover"
import { useSelectedId } from "@lib/workspace/selection-target"
import type { NodeRect } from "../tracking/hooks/use-node-rects-store"
import {
  getCanvasSelectionElements,
  getUnionRect,
} from "./helpers/canvas-selection-target"
import { useCanvasOverlayStore } from "./hooks/use-canvas-overlay-store"

/** Frames to wait for a target to mount after a board switch before giving up. */
const MAX_TARGET_FRAMES = 30

/** Canvas-relative union rect of every element registered under the id. */
function measure(id: string | null): NodeRect | null {
  if (!id) return null
  const union = getUnionRect(getCanvasSelectionElements(id))
  if (!union) return null
  const canvas = document.getElementById("canvas")?.getBoundingClientRect()
  if (!canvas) return null
  return {
    top: union.top - canvas.top,
    left: union.left - canvas.left,
    width: union.width,
    height: union.height,
  }
}

function rectsEqual(a: NodeRect | null, b: NodeRect | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height
  )
}

/**
 * Measures the hovered and selected objects' rects and writes them to the
 * overlay store. Mounted inside the pan/zoom transform so it can re-measure on
 * every transform frame, keeping the hover and selection outlines glued during
 * pan and zoom (which fire no scroll/resize events). A bounded rAF retry covers
 * the frames after a board switch before the target element mounts.
 */
export function CanvasOverlayTracker() {
  const transformContext = useTransformContext()
  const hoveredId = useHoveredId()
  const selectedId = useSelectedId()

  const transformContextRef = useRef(transformContext)
  transformContextRef.current = transformContext

  useEffect(() => {
    let rafId = 0
    let frames = 0

    const apply = () => {
      const store = useCanvasOverlayStore.getState()
      const hover = measure(hoveredId)
      const selection = measure(selectedId)
      if (!rectsEqual(store.hoverRect, hover)) store.setHoverRect(hover)
      if (!rectsEqual(store.selectionRect, selection)) {
        store.setSelectionRect(selection)
      }

      const missing = (hoveredId && !hover) || (selectedId && !selection)
      if (missing && frames++ < MAX_TARGET_FRAMES) {
        rafId = requestAnimationFrame(apply)
      }
    }

    apply()
    const unsubscribe = transformContextRef.current.onChange(apply)
    window.addEventListener("scroll", apply, true)
    window.addEventListener("resize", apply)

    return () => {
      cancelAnimationFrame(rafId)
      unsubscribe()
      window.removeEventListener("scroll", apply, true)
      window.removeEventListener("resize", apply)
    }
  }, [hoveredId, selectedId])

  return null
}
