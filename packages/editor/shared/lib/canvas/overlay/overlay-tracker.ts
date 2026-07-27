import {
  type Board,
  type InstanceId,
  type VariantId,
  type Workspace,
  nodeRetrievalService,
} from "@seldon/core"
import { canNodeAcceptChildren } from "../../workspace/can-node-accept-children"
import type { SelectionKind } from "../../workspace/selection-kind"
import { remeasureStore } from "../remeasure/remeasure-store"
import { measureNode, measureSelection, rectsEqual } from "./measure"
import {
  DEFAULT_OUTLINE_COLORS,
  type OutlineColors,
  resolveOutlineColorsForBoard,
  resolveOutlineColorsForNode,
} from "./outline-colors"
import {
  overlayStore,
  setHoverOutlineColors,
  setHoverRect,
  setSelectionOutlineColors,
  setSelectionRect,
} from "./overlay-store"

/** Frames to wait for a target to mount after a board switch before giving up. */
const MAX_TARGET_FRAMES = 30

/** Seldon accent token used for the insert component tool hover box. */
const ACCENT_HOVER_COLOR = "var(--sdn-swatch-accent)"

export interface OverlayTrackerContext {
  getHovered: () => {
    id: string | null
    kind: SelectionKind | null
    rootId: string | null
  }
  getSelected: () => {
    id: string | null
    nodeId: string | null
    rootId: string | null
  }
  getWorkspace: () => Workspace
  getActiveBoard: () => Board | null
  getActiveTool: () => string
  /** Subscribe to pan/zoom transform changes. Returns an unsubscribe. */
  subscribeTransform: (listener: () => void) => () => void
}

export interface OverlayTracker {
  /** Recompute the hover and selection outline colors from the workspace. */
  updateColors: () => void
  /** Re-measure the hover and selection rects, resetting the mount retry. */
  refresh: () => void
  destroy: () => void
}

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

/**
 * Framework-neutral port of the canvas overlay tracker. Measures the hovered and
 * selected objects' rects and writes them plus their colors to the overlay
 * store. The measurement loop re-runs on every pan/zoom transform frame plus
 * window scroll and resize, so the outlines stay glued. A bounded rAF retry
 * covers the frames after a board switch before the target element mounts.
 */
export function createOverlayTracker(
  ctx: OverlayTrackerContext,
): OverlayTracker {
  let retryRaf = 0
  let scheduledRaf = 0
  let frames = 0

  const apply = (): void => {
    // While the canvas pans or zooms, re-measuring the moving target every frame
    // forces a full reflow of the board subtree, which stutters large boards.
    // Hide the outlines while transforming and let the settle bump re-measure at
    // the final position.
    if (remeasureStore.getState().isTransforming) {
      if (overlayStore.getState().hoverRect !== null) setHoverRect(null)
      if (overlayStore.getState().selectionRect !== null) setSelectionRect(null)
      return
    }

    const hovered = ctx.getHovered()
    const selected = ctx.getSelected()

    // Node hover/selection scopes to the hovered or clicked column; other kinds
    // (theme variant, font specimen group) keep the grouped union.
    const hover =
      hovered.kind === "node"
        ? measureNode(hovered.id, hovered.rootId)
        : measureSelection(hovered.id)
    const selection = selected.nodeId
      ? measureNode(selected.nodeId, selected.rootId)
      : measureSelection(selected.id)

    if (!rectsEqual(overlayStore.getState().hoverRect, hover)) {
      setHoverRect(hover)
    }
    if (!rectsEqual(overlayStore.getState().selectionRect, selection)) {
      setSelectionRect(selection)
    }

    const missing = (hovered.id && !hover) || (selected.id && !selection)
    if (missing && frames++ < MAX_TARGET_FRAMES) {
      retryRaf = requestAnimationFrame(apply)
    }
  }

  // Coalesce a burst of scroll/transform ticks into a single measurement per
  // frame. Each `apply` forces a synchronous layout read, so measuring once per
  // frame instead of once per event avoids layout thrashing.
  const schedule = (): void => {
    if (scheduledRaf) return
    scheduledRaf = requestAnimationFrame(() => {
      scheduledRaf = 0
      apply()
    })
  }

  const updateColors = (): void => {
    const hovered = ctx.getHovered()
    const selected = ctx.getSelected()
    const workspace = ctx.getWorkspace()
    const activeBoard = ctx.getActiveBoard()
    const activeTool = ctx.getActiveTool()

    if (!hovered.id) {
      if (overlayStore.getState().hoverOutlineColors !== null) {
        setHoverOutlineColors(null)
      }
    } else {
      const colors =
        hovered.kind === "node"
          ? resolveOutlineColorsForNode(hovered.id)
          : activeBoard
            ? resolveOutlineColorsForBoard(activeBoard)
            : null
      const hoverColors =
        activeTool === "component" && hovered.kind === "node"
          ? resolveComponentHoverColors(hovered.id, workspace, colors)
          : colors
      setHoverOutlineColors(hoverColors)
    }

    if (!selected.id) {
      if (overlayStore.getState().selectionOutlineColors !== null) {
        setSelectionOutlineColors(null)
      }
    } else {
      const colors = selected.nodeId
        ? resolveOutlineColorsForNode(selected.nodeId)
        : activeBoard
          ? resolveOutlineColorsForBoard(activeBoard)
          : null
      setSelectionOutlineColors(colors)
    }
  }

  const refresh = (): void => {
    frames = 0
    cancelAnimationFrame(retryRaf)
    apply()
  }

  const unsubscribeTransform = ctx.subscribeTransform(schedule)
  window.addEventListener("scroll", schedule, { passive: true, capture: true })
  window.addEventListener("resize", schedule)

  updateColors()
  apply()

  const destroy = (): void => {
    cancelAnimationFrame(retryRaf)
    cancelAnimationFrame(scheduledRaf)
    unsubscribeTransform()
    window.removeEventListener("scroll", schedule, true)
    window.removeEventListener("resize", schedule)
  }

  return { updateColors, refresh, destroy }
}
