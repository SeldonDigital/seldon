"use client"

import { useEffect, useRef } from "react"
import { useTransformContext } from "react-zoom-pan-pinch"
import { nodeRetrievalService } from "@seldon/core/workspace/services"
import type {
  InstanceId,
  VariantId,
  Workspace,
} from "@seldon/core/workspace/types"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import {
  useHoveredId,
  useHoveredKind,
  useHoveredRootId,
} from "@lib/workspace/hooks/use-object-hover"
import {
  useSelectedNodeId,
  useSelectedNodeRootId,
} from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useTool } from "@lib/hooks/use-tool"
import type { NodeRect } from "../tracking/hooks/use-node-rects-store"
import { useCanvasOverlayStore } from "./hooks/use-canvas-overlay-store"
import { useCanvasRemeasureStore } from "./hooks/use-canvas-remeasure-store"
import { canNodeAcceptChildren } from "@lib/workspace/can-node-accept-children"
import { useSelectedId } from "@lib/workspace/selection-target"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { DEFAULT_OUTLINE_COLORS } from "../tracking/helpers/resolve-outline-surface"
import type { OutlineColors } from "../tracking/helpers/resolve-outline-surface"
import {
  pickOutlineColorsFromSurface,
  resolveOutlineSurfaceForBoard,
  resolveOutlineSurfaceForNode,
} from "../tracking/helpers/resolve-outline-surface"
import {
  getCanvasSelectionElements,
  getScopedSelectionElement,
  getUnionRect,
} from "./helpers/canvas-selection-target"
import { INSERT_HOVER_ACCENT } from "./canvas.bespoke"

/** Frames to wait for a target to mount after a board switch before giving up. */
const MAX_TARGET_FRAMES = 30

/** Seldon accent token used for the insert component tool hover box. */
const ACCENT_HOVER_COLOR = INSERT_HOVER_ACCENT

/**
 * Hover outline colors for the insert component tool. A node that can accept
 * children gets the accent color to signal a valid insertion target; anything
 * else keeps the contrast based colors so it reads like a normal hover.
 */
function resolveComponentHoverColors(
  hoveredId: string,
  workspace: Workspace,
  baseColors: OutlineColors | null,
): OutlineColors | null {
  let acceptsChildren = false
  try {
    const node = nodeRetrievalService.getNode(
      hoveredId as InstanceId | VariantId,
      workspace,
    )
    acceptsChildren = canNodeAcceptChildren(node, workspace)
  } catch {
    acceptsChildren = false
  }

  if (!acceptsChildren) return baseColors

  return {
    hover: ACCENT_HOVER_COLOR,
    selection: baseColors?.selection ?? DEFAULT_OUTLINE_COLORS.selection,
  }
}

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
function measureNode(
  id: string | null,
  rootId: string | null,
): NodeRect | null {
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
  const isTransforming = useCanvasRemeasureStore(
    (state) => state.isTransforming,
  )
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeBoard } = useActiveBoard()
  const { activeTool } = useTool()
  const activeBoardKey = activeBoard ? getComponentKey(activeBoard) : null

  const transformContextRef = useRef(transformContext)
  transformContextRef.current = transformContext

  useEffect(() => {
    const store = useCanvasOverlayStore.getState()

    if (!hoveredId) {
      if (store.hoverOutlineColors !== null) {
        store.setHoverOutlineColors(null)
      }
    } else {
      const surface =
        hoveredKind === "node"
          ? resolveOutlineSurfaceForNode(hoveredId, workspace)
          : activeBoard
            ? resolveOutlineSurfaceForBoard(activeBoard, workspace)
            : null
      const colors = surface ? pickOutlineColorsFromSurface(surface) : null
      // In the insert component tool, accent the hover box for nodes that can
      // accept children; non-accepting nodes keep the contrast colors.
      const hoverColors =
        activeTool === "component" && hoveredKind === "node"
          ? resolveComponentHoverColors(hoveredId, workspace, colors)
          : colors
      store.setHoverOutlineColors(hoverColors)
    }

    if (!selectedId) {
      if (store.selectionOutlineColors !== null) {
        store.setSelectionOutlineColors(null)
      }
    } else {
      const surface = selectedNodeId
        ? resolveOutlineSurfaceForNode(selectedNodeId, workspace)
        : activeBoard
          ? resolveOutlineSurfaceForBoard(activeBoard, workspace)
          : null
      const colors = surface ? pickOutlineColorsFromSurface(surface) : null
      store.setSelectionOutlineColors(colors)
    }
  }, [
    hoveredId,
    hoveredKind,
    selectedId,
    selectedNodeId,
    remeasureVersion,
    workspace,
    activeBoard,
    activeBoardKey,
    activeTool,
  ])

  useEffect(() => {
    let retryRaf = 0
    let scheduledRaf = 0
    let frames = 0

    const apply = () => {
      const store = useCanvasOverlayStore.getState()
      // While the canvas pans or zooms, re-measuring the moving target every
      // frame forces a full reflow of the board subtree and re-renders the
      // outline components each frame, which makes large boards (Table,
      // Calendar) stutter. Mirror the wireframe boxes: hide the hover and
      // selection outlines while transforming and let the settle bump
      // re-measure them at the final position.
      if (useCanvasRemeasureStore.getState().isTransforming) {
        if (store.hoverRect !== null) store.setHoverRect(null)
        if (store.selectionRect !== null) store.setSelectionRect(null)
        return
      }
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
        retryRaf = requestAnimationFrame(apply)
      }
    }

    // Coalesce a burst of scroll/transform ticks into a single measurement per
    // frame. Each `apply` forces a synchronous layout read, so measuring once
    // per animation frame instead of once per event avoids the layout
    // thrashing that makes scrolling and panning feel laggy.
    const schedule = () => {
      if (scheduledRaf) return
      scheduledRaf = requestAnimationFrame(() => {
        scheduledRaf = 0
        apply()
      })
    }

    apply()
    const unsubscribe = transformContextRef.current.onChange(schedule)
    window.addEventListener("scroll", schedule, {
      passive: true,
      capture: true,
    })
    window.addEventListener("resize", schedule)

    return () => {
      cancelAnimationFrame(retryRaf)
      cancelAnimationFrame(scheduledRaf)
      unsubscribe()
      window.removeEventListener("scroll", schedule, true)
      window.removeEventListener("resize", schedule)
    }
  }, [
    hoveredId,
    hoveredKind,
    hoveredRootId,
    selectedId,
    selectedNodeId,
    selectedNodeRootId,
    remeasureVersion,
    isTransforming,
  ])

  return null
}
