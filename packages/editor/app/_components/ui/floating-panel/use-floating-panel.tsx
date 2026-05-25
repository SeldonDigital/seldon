import { getWindowInnerSize } from "@lib/utils/get-window-inner-size"
import {
  BoundingBox,
  PanInfo,
  useDragControls,
  useMotionValue,
} from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { PANEL_MIN_HEIGHT, PANEL_MIN_WIDTH } from "@components/constants"

export type Side =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

export function useFloatingPanel({
  initialPosition,
  initialSize,
  handleClose,
  closeOnEscape = true,
}: {
  initialPosition: { x: number; y: number }
  initialSize: { width: number; height: number }
  handleClose: () => void
  closeOnEscape?: boolean
}) {
  const moveControls = useDragControls()
  const x = useMotionValue(initialPosition.x)
  const y = useMotionValue(initialPosition.y)
  const width = useMotionValue(initialSize.width)
  const height = useMotionValue(initialSize.height)

  const [rectBeforeResize, setRectBeforeResize] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
    width: initialSize.width,
    height: initialSize.height,
  })

  const { width: windowWidth, height: windowHeight } = getWindowInnerSize()
  const [dragConstraints, setDragConstraints] = useState<BoundingBox>({
    top: 0,
    left: 0,
    right: windowWidth - width.get(),
    bottom: windowHeight - height.get(),
  })

  const handleResizeStart = useCallback(() => {
    setRectBeforeResize({
      x: x.get(),
      y: y.get(),
      width: width.get(),
      height: height.get(),
    })
  }, [height, width, x, y])

  const handleResize = useCallback(
    (side: Side, info: PanInfo) => {
      let newX = rectBeforeResize.x
      let newY = rectBeforeResize.y
      let newWidth = rectBeforeResize.width
      let newHeight = rectBeforeResize.height

      if (side.includes("right")) {
        newWidth = rectBeforeResize.width + info.offset.x
      }

      if (side.includes("left")) {
        newWidth = rectBeforeResize.width - info.offset.x
        newX = rectBeforeResize.x + info.offset.x
      }

      if (side.includes("bottom")) {
        newHeight = rectBeforeResize.height + info.offset.y
      }

      if (side.includes("top")) {
        newHeight = rectBeforeResize.height - info.offset.y
        newY = rectBeforeResize.y + info.offset.y
      }

      if (newWidth > PANEL_MIN_WIDTH) {
        x.set(newX)
        width.set(newWidth)
      }

      if (newHeight > PANEL_MIN_HEIGHT) {
        y.set(newY)
        height.set(newHeight)
      }
    },
    [rectBeforeResize, x, width, y, height],
  )

  /**
   * Update the drag constraints based on the width and height of the panel
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
   * Listen to escape key to close the panel
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
   *
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
    handleResizeStart,
    handleResize,
    moveControls,
    dragConstraints,
  }
}
