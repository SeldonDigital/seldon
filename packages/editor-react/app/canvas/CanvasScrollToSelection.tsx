"use client"

import { useEffect, useRef } from "react"
import { useControls, useTransformContext } from "react-zoom-pan-pinch"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useEditorConfig } from "@app/hooks/use-editor-config"
import {
  getCanvasSelectionElements,
  getUnionRect,
} from "./helpers/canvas-selection-target"

/** Animation duration for the pan-to-selection move (ms). */
const SCROLL_ANIMATION_MS = 300

/**
 * Vertical landing point for the selection as a fraction of canvas height.
 * `0.5` centers it; lower values bias the selection higher up the canvas. The
 * bias is applied against the canvas height, not the target height, so every
 * selection lands in the same place regardless of its own size.
 */
const VERTICAL_BIAS = 0.25

/**
 * Frames to wait for the target element to mount before giving up. Selecting a
 * node can switch the active board, and the new board's DOM renders a frame or
 * two later, so the target is not measurable on the first pass.
 */
const MAX_TARGET_FRAMES = 30

/**
 * Pans the canvas so the current selection is centered in the visible canvas.
 *
 * Every selection kind resolves through one mechanism: the canvas elements
 * tagged with the current selection id (see `canvas-selection-target`). Their
 * union box is centered, so a single element (node, theme variant, font family)
 * and a group (a font-collection variant's specimens) follow the same path.
 *
 * Board selections are excluded: a board fills the canvas and is top-aligned by
 * the transform reset, so centering it would push a tall board off-screen.
 *
 * Selecting a node can switch the active board, which re-renders the canvas; the
 * target element then mounts a frame or two later. The scroll waits for it on
 * `requestAnimationFrame` instead of measuring once and bailing, so a selection
 * that triggers a board switch animates the same as one that does not.
 *
 * Mounted inside the pan/zoom transform so it can drive `setTransform`. Zoom is
 * preserved; only the position changes. Gated by the "Scroll to Selection"
 * setting. Every selection always centers with the same animation so node,
 * theme, and font-collection selections behave identically.
 */
export function CanvasScrollToSelection() {
  const { setTransform } = useControls()
  const transformContext = useTransformContext()
  const { autoScrollToSelection } = useEditorConfig()
  const {
    selectedResourceItemKey,
    selectedNodeId,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
  } = useSelection()

  // The single selection id shared across board types. Board selection is
  // omitted on purpose (a board is the whole canvas, not a target inside it).
  const selectionId =
    selectedResourceItemKey ??
    selectedNodeId ??
    selectedThemeEntryId ??
    selectedFontCollectionEntryId ??
    null

  // `useControls` returns a fresh object each render, so its `setTransform`
  // identity churns. Hold the transform handles in refs and key the effect only
  // on the selection so it fires once per selection change, never per render.
  // Otherwise unrelated re-renders (e.g. workspace edits) would re-trigger an
  // animated pan and make the canvas feel laggy.
  const setTransformRef = useRef(setTransform)
  setTransformRef.current = setTransform
  const transformContextRef = useRef(transformContext)
  transformContextRef.current = transformContext

  useEffect(() => {
    if (!autoScrollToSelection || !selectionId) return

    const canvasEl = document.getElementById("canvas")
    if (!canvasEl) return

    let rafId = 0
    let frames = 0

    const run = () => {
      const elements = getCanvasSelectionElements(selectionId)
      const target = getUnionRect(elements)

      // The target board may still be rendering after a board switch. Retry on
      // the next frame until it mounts, bounded so we never loop forever.
      if (!target) {
        if (frames++ < MAX_TARGET_FRAMES) {
          rafId = requestAnimationFrame(run)
        }
        return
      }

      const canvasRect = canvasEl.getBoundingClientRect()

      // Pan so the target center lands at the canvas's vertical bias point. The
      // transform translate maps 1:1 to screen pixels regardless of scale, so
      // the delta between the current target center and that point can be added
      // directly to the current position. Scale is preserved.
      const { scale, positionX, positionY } =
        transformContextRef.current.transformState
      const deltaX =
        canvasRect.left +
        canvasRect.width / 2 -
        (target.left + target.width / 2)
      const deltaY =
        canvasRect.top +
        canvasRect.height * VERTICAL_BIAS -
        (target.top + target.height / 2)

      setTransformRef.current(
        positionX + deltaX,
        positionY + deltaY,
        scale,
        SCROLL_ANIMATION_MS,
      )
    }

    rafId = requestAnimationFrame(run)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [autoScrollToSelection, selectionId])

  return null
}
