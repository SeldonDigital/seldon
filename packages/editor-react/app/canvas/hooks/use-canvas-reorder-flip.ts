"use client"

import { RefObject, useLayoutEffect, useRef } from "react"

import { Workspace } from "@seldon/core"

import { useCanvasRemeasureStore } from "./use-canvas-remeasure-store"

const FLIP_DURATION_MS = 200
const FLIP_EASING = "cubic-bezier(0.2, 0, 0, 1)"
/** Below this many pixels of movement an element is treated as not moved. */
const MOVE_THRESHOLD_PX = 0.5
/** Extra time past the glide before re-measuring, so transforms are cleared. */
const SETTLE_BUFFER_MS = 30

type Point = { left: number; top: number }

/**
 * Animates canvas node reorders with a FLIP pass.
 *
 * The canvas renders export-fidelity DOM, so reordering a child snaps it to its
 * new position in a single reflow. After each workspace change this hook plays
 * every moved node from its previous position to its new one using an additive
 * `transform` animation. The transform does not affect layout and composes on
 * top of any base transform, so the rendered structure and exported output are
 * untouched.
 *
 * Preview writes are debounced upstream in the drag monitor, so each pass moves
 * a node directly to the slot the cursor settled on. The FLIP therefore plays a
 * single glide to that slot rather than stepping through every slot crossed.
 *
 * Positions are measured relative to each node's root variant, not the viewport.
 * One board root holds every variant, so reordering inside one variant can
 * reflow the board and shift the other variants as whole blocks. Measuring
 * against the root variant cancels that shared translation, so an untouched
 * variant stays put while only nodes that changed order within their variant
 * animate. Distances are divided by the root's current scale so they stay
 * correct under canvas zoom.
 *
 * @param rootRef - The board root element whose descendants are animated.
 * @param workspace - The preview-aware workspace; drives the animation pass.
 */
export function useCanvasReorderFlip(
  rootRef: RefObject<HTMLElement | null>,
  workspace: Workspace,
): void {
  const previousPositions = useRef<Map<string, Point>>(new Map())
  const runningAnimations = useRef<Map<string, Animation>>(new Map())
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    // The glide leaves the trackers measuring the pre-animation position. Once
    // it settles, nudge them to re-measure so selection, hover, and wireframe
    // outlines snap to the node's final spot. Reset per pass so only the last
    // settle fires when previews arrive in quick succession.
    if (settleTimer.current) clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      useCanvasRemeasureStore.getState().bump()
    }, FLIP_DURATION_MS + SETTLE_BUFFER_MS)

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    const scale = getRootScale(root)
    // Document order, so an ancestor is always visited before its descendants.
    const elements = root.querySelectorAll<HTMLElement>("[data-canvas-node-id]")
    const nextPositions = new Map<string, Point>()
    const animatedElements = new Set<Element>()

    elements.forEach((element) => {
      const id = element.getAttribute("data-canvas-node-id")
      if (!id) return

      // Cancel any in-flight FLIP so the measurement is the base layout
      // position without the animation's transform.
      runningAnimations.current.get(id)?.cancel()
      runningAnimations.current.delete(id)

      // Measure relative to the node's root variant so a whole-variant shift
      // from a board reflow cancels out and does not register as movement.
      const rootVariant = getRootVariantElement(element, root)
      const rootRect = rootVariant.getBoundingClientRect()
      const baseRect = element.getBoundingClientRect()
      const base: Point = {
        left: baseRect.left - rootRect.left,
        top: baseRect.top - rootRect.top,
      }
      nextPositions.set(id, base)

      if (prefersReducedMotion) return

      const previous = previousPositions.current.get(id)
      if (!previous) return // First appearance: nothing to animate from.

      const deltaX = (previous.left - base.left) / scale
      const deltaY = (previous.top - base.top) / scale
      if (
        Math.abs(deltaX) < MOVE_THRESHOLD_PX &&
        Math.abs(deltaY) < MOVE_THRESHOLD_PX
      ) {
        return
      }

      // Skip descendants of an already-animating node. They sit inside that
      // node in the DOM and inherit its transform, so animating them too would
      // double their movement and snap them back when the drag is released.
      if (hasAnimatedAncestor(element, root, animatedElements)) return

      animatedElements.add(element)

      const animation = element.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0px, 0px)" },
        ],
        {
          duration: FLIP_DURATION_MS,
          easing: FLIP_EASING,
          // Add on top of any base transform from the node's own CSS.
          composite: "add",
        },
      )
      runningAnimations.current.set(id, animation)
      animation.finished
        .then(() => {
          if (runningAnimations.current.get(id) === animation) {
            runningAnimations.current.delete(id)
          }
        })
        .catch(() => {
          // Cancelled animations reject; nothing to clean up beyond the map.
        })
    })

    previousPositions.current = nextPositions

    return () => {
      if (settleTimer.current) clearTimeout(settleTimer.current)
    }
  }, [rootRef, workspace])
}

/**
 * Returns the topmost canvas node between `element` and `root`, which is the
 * variant root the node belongs to. Falls back to `element` itself when it is
 * already a top-level node.
 */
function getRootVariantElement(
  element: HTMLElement,
  root: HTMLElement,
): HTMLElement {
  let topmost = element
  let ancestor = element.parentElement
  while (ancestor && ancestor !== root) {
    if (ancestor.hasAttribute("data-canvas-node-id")) {
      topmost = ancestor
    }
    ancestor = ancestor.parentElement
  }
  return topmost
}

/**
 * Whether a node element between `element` and `root` is already animating.
 * Such an ancestor carries this element via the inherited transform.
 */
function hasAnimatedAncestor(
  element: HTMLElement,
  root: HTMLElement,
  animatedElements: Set<Element>,
): boolean {
  let ancestor = element.parentElement
  while (ancestor && ancestor !== root) {
    if (
      ancestor.hasAttribute("data-canvas-node-id") &&
      animatedElements.has(ancestor)
    ) {
      return true
    }
    ancestor = ancestor.parentElement
  }
  return false
}

/** Derives the rendered scale of the root from its layout vs box width. */
function getRootScale(root: HTMLElement): number {
  const layoutWidth = root.offsetWidth
  if (!layoutWidth) return 1
  const renderedWidth = root.getBoundingClientRect().width
  const scale = renderedWidth / layoutWidth
  return scale > 0 ? scale : 1
}
