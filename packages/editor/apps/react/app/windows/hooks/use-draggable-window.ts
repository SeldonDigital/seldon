import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { useDragControls, useMotionValue } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"

import type { Rect } from "@seldon/components/utils/resize"
import type { BoundingBox } from "framer-motion"

/** The smallest a floating window is drawn at, and the size one opens at by default. */
export const MIN_WINDOW_SIZE = { width: 300, height: 300 }

/**
 * Open windows that close on Escape, most recently opened last.
 *
 * Every floating window once bound its own `keydown` listener, so one Escape closed all of
 * them at once, including palettes meant to stay open behind a dialog. They share this stack
 * instead: Escape closes only the last window opened, so a dialog opened over a palette closes
 * alone and the palette stays. Registration order stands in for stacking order, which holds
 * because a window is opened onto the top.
 */
const escapeStack: Array<() => void> = []

function handleGlobalEscape(event: KeyboardEvent): void {
  if (event.key !== "Escape") return

  const close = escapeStack.at(-1)

  if (close) close()
}

/** Puts a window on top of the Escape stack, returning the removal for its unmount. */
function pushEscapeHandler(close: () => void): () => void {
  if (escapeStack.length === 0) {
    window.addEventListener("keydown", handleGlobalEscape)
  }

  escapeStack.push(close)

  return () => {
    const index = escapeStack.lastIndexOf(close)

    if (index !== -1) escapeStack.splice(index, 1)

    if (escapeStack.length === 0) {
      window.removeEventListener("keydown", handleGlobalEscape)
    }
  }
}

/**
 * Drag, resize, and position mechanics for a floating editor window. Shared by
 * every view-model that opens one, whether a dialog, a palette, or a card on the
 * canvas: it owns the motion values, drag controls, resize handlers, and drag
 * constraints that `WindowSurface` renders.
 */
export function useDraggableWindow({
  initialPosition,
  initialSize,
  handleClose,
  closeOnEscape = true,
  minWidth = MIN_WINDOW_SIZE.width,
  minHeight = MIN_WINDOW_SIZE.height,
  contentSized = false,
}: {
  handleClose: () => void
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  closeOnEscape?: boolean
  minWidth?: number
  minHeight?: number
  contentSized?: boolean
}) {
  const moveControls = useDragControls()
  // A content-sized window centers itself with flexbox and drags as an offset
  // from that center, so its motion values start at zero and it carries no
  // explicit size. A resizable window drives absolute position and size, so it
  // seeds the motion values from the caller's position and size.
  const startPosition = initialPosition ?? { x: 0, y: 0 }
  const startSize = initialSize ?? { width: 0, height: 0 }
  const x = useMotionValue(startPosition.x)
  const y = useMotionValue(startPosition.y)
  const width = useMotionValue(startSize.width)
  const height = useMotionValue(startSize.height)

  const { width: windowWidth, height: windowHeight } = getWindowInnerSize()
  const [dragConstraints, setDragConstraints] = useState<BoundingBox>({
    top: 0,
    left: 0,
    right: windowWidth - width.get(),
    bottom: windowHeight - height.get(),
  })

  // Suppress native text selection while dragging a resize handle across the
  // surface. Restore it once the pointer is released.
  const onResizeStart = useCallback(() => {
    const previousUserSelect = document.body.style.userSelect

    document.body.style.userSelect = "none"

    const restoreUserSelect = () => {
      document.body.style.userSelect = previousUserSelect
      window.removeEventListener("pointerup", restoreUserSelect)
    }

    window.addEventListener("pointerup", restoreUserSelect)
  }, [])

  const getRect = useCallback(
    (): Rect => ({
      x: x.get(),
      y: y.get(),
      width: width.get(),
      height: height.get(),
    }),
    [x, y, width, height],
  )

  const onResize = useCallback(
    (rect: Rect) => {
      x.set(rect.x)
      y.set(rect.y)
      width.set(rect.width)
      height.set(rect.height)
    },
    [x, y, width, height],
  )

  /**
   * Update the drag constraints based on the width and height of the window
   */
  useEffect(() => {
    const unsubscribeWidth = width.on("change", (width) =>
      setDragConstraints((box) => ({
        ...box,
        right: windowWidth - width,
      })),
    )
    const unsubscribeHeight = height.on("change", (height) =>
      setDragConstraints((box) => ({
        ...box,
        bottom: windowHeight - height,
      })),
    )

    return () => {
      unsubscribeWidth()
      unsubscribeHeight()
    }
  }, [width, height, windowWidth, windowHeight])

  // The latest close, held in a ref so the window registers once on open and keeps its place
  // in the stack, rather than re-registering to the top whenever `handleClose` changes.
  const handleCloseRef = useRef(handleClose)
  handleCloseRef.current = handleClose

  // Join the shared Escape stack while open, so only the top window closes on Escape.
  useEffect(() => {
    if (!closeOnEscape) return

    return pushEscapeHandler(() => handleCloseRef.current())
  }, [closeOnEscape])

  /**
   * Recalculate the drag constraints when the window is resized
   */
  useEffect(() => {
    function handleResize() {
      setDragConstraints({
        top: 0,
        left: 0,
        right: windowWidth - width.get(),
        bottom: windowHeight - height.get(),
      })
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [width, height, windowWidth, windowHeight])

  return {
    x,
    y,
    width,
    height,
    onResizeStart,
    getRect,
    onResize,
    moveControls,
    dragConstraints,
    minWidth,
    minHeight,
    contentSized,
  }
}
