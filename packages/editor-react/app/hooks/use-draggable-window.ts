import { getWindowInnerSize } from "@seldon/editor/lib/helpers/get-window-inner-size"
import { BoundingBox, useDragControls, useMotionValue } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { Rect } from "@seldon/components/utils/resize"

const DEFAULT_MIN_WINDOW_WIDTH = 300
const DEFAULT_MIN_WINDOW_HEIGHT = 300

/**
 * Drag, resize, and position mechanics for a floating editor window. Shared by
 * the dialog and palette view-models: it owns the motion values, drag controls,
 * resize handlers, and drag constraints that `WindowOverlay` renders.
 */
export function useDraggableWindow({
  initialPosition,
  initialSize,
  handleClose,
  closeOnEscape = true,
  minWidth = DEFAULT_MIN_WINDOW_WIDTH,
  minHeight = DEFAULT_MIN_WINDOW_HEIGHT,
  contentSized = false,
}: {
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  handleClose: () => void
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

  /**
   * Listen to escape key to close the window
   */
  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleEscapeKey)
    return () => window.removeEventListener("keydown", handleEscapeKey)
  }, [closeOnEscape, handleClose])

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
