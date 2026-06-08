"use client"

import { useEffect, useRef } from "react"
import { useTransformContext } from "react-zoom-pan-pinch"
import {
  useHoveredId,
  useHoveredKind,
  useHoveredRootId,
} from "@lib/workspace/hooks/use-object-hover"
import { useSelectedId } from "@lib/workspace/selection-target"
import {
  useSelectedNodeId,
  useSelectedNodeRootId,
} from "@lib/workspace/hooks/use-selection"
import type { NodeRect } from "../tracking/hooks/use-node-rects-store"
import {
  getCanvasSelectionElements,
  getScopedSelectionElement,
  getUnionRect,
} from "./helpers/canvas-selection-target"
import { useCanvasOverlayStore } from "./hooks/use-canvas-overlay-store"
import { useCanvasRemeasureStore } from "./hooks/use-canvas-remeasure-store"

/** Frames to wait for a target to mount after a board switch before giving up. */
const MAX_TARGET_FRAMES = 30

/** Converts a viewport rect to one relative to the canvas origin. */
function toCanvasRect(rect: DOMRect | null): NodeRect | null {
  if (!rect) return null
  const canvas = document.getElementById("canvas")?.getBoundingClientRect()
  if (!canvas) return null
  return {
    top: rect.top - canvas.top,
    left: rect.left - canvas.left,
    width: rect.width,
    height: rect.height,
  }
}

/** Canvas-relative union rect of every element registered under the id. */
function measure(id: string | null): NodeRect | null {
  if (!id) return null
  return toCanvasRect(getUnionRect(getCanvasSelectionElements(id)))
}

/**
 * Canvas-relative rect of a single node, scoped to its variant-root column so a
 * child id shared across columns outlines only the clicked copy.
 */
function measureNode(id: string | null, rootId: string | null): NodeRect | null {
  if (!id) return null
  const element = getScopedSelectionElement(id, rootId)
  return toCanvasRect(element ? element.getBoundingClientRect() : null)
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
  const hoveredKind = useHoveredKind()
  const hoveredRootId = useHoveredRootId()
  const selectedId = useSelectedId()
  const selectedNodeId = useSelectedNodeId()
  const selectedNodeRootId = useSelectedNodeRootId()
  const remeasureVersion = useCanvasRemeasureStore((state) => state.version)

  const transformContextRef = useRef(transformContext)
  transformContextRef.current = transformContext

  useEffect(() => {
    let rafId = 0
    let frames = 0

    const apply = () => {
      const store = useCanvasOverlayStore.getState()
      // Node hover/selection scopes to the hovered or clicked column; other
      // kinds (theme variant, font specimen group) keep the grouped union.
      const hover =
        hoveredKind === "node"
          ? measureNode(hoveredId, hoveredRootId)
          : measure(hoveredId)
      const selection = selectedNodeId
        ? measureNode(selectedNodeId, selectedNodeRootId)
        : measure(selectedId)
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
  }, [
    hoveredId,
    hoveredKind,
    hoveredRootId,
    selectedId,
    selectedNodeId,
    selectedNodeRootId,
    remeasureVersion,
  ])

  return null
}
