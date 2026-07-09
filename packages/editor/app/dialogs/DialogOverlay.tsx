import { CSSProperties, ReactNode } from "react"
import { createPortal } from "react-dom"
import { BoundingBox, DragControls, MotionValue, motion } from "framer-motion"
import { Backdrop } from "@seldon/components/custom-components"
import {
  Rect,
  ResizeSide,
  createResizeHandle,
  getResizeHandleStyle,
} from "@seldon/components/utils/resize"

const DEFAULT_RESIZE_SIDES: readonly ResizeSide[] = [
  "left",
  "right",
  "bottom",
  "bottom-left",
  "bottom-right",
]

interface DialogOverlayProps {
  onClose: () => void
  children: ReactNode
  x: MotionValue<number>
  y: MotionValue<number>
  width: MotionValue<number>
  height: MotionValue<number>
  moveControls: DragControls
  dragConstraints: BoundingBox
  onResizeStart: () => void
  onResize: (rect: Rect) => void
  getRect: () => Rect
  resizeSides?: readonly ResizeSide[]
  minWidth?: number
  minHeight?: number
}

/**
 * Draggable, resizable dialog surface. Renders a full-area backdrop that closes
 * on click and a fixed, motion-driven surface, both portaled to the document
 * body. All drag and resize wiring arrives via props, matching
 * `FloatingPanelSurface`; this View only renders the surface and edge handles.
 *
 * The caller starts a drag from its own handle by calling `moveControls.start`.
 * Resize handles cover the `resizeSides` the caller passes and drive `onResize`
 * through the shared resize helpers.
 */
export function DialogOverlay({
  onClose,
  children,
  x,
  y,
  width,
  height,
  moveControls,
  dragConstraints,
  onResizeStart,
  onResize,
  getRect,
  resizeSides = DEFAULT_RESIZE_SIDES,
  minWidth,
  minHeight,
}: DialogOverlayProps) {
  const surfaceMotionStyle = { x, y, width, height, ...surfaceStyle }

  const resizeHandles = resizeSides.map((side) => {
    const { onPointerDown } = createResizeHandle({
      side,
      getRect,
      onResize,
      minWidth,
      minHeight,
      onStart: onResizeStart,
    })
    return (
      <div key={side} onPointerDown={onPointerDown} style={getResizeHandleStyle(side)} />
    )
  })

  return createPortal(
    <>
      <Backdrop onClick={onClose} style={backdropStyle} />
      <motion.div
        drag
        dragControls={moveControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={false}
        dragConstraints={dragConstraints}
        style={surfaceMotionStyle}
      >
        {children}
        {resizeHandles}
      </motion.div>
    </>,
    document.body,
  )
}

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 30,
}

const surfaceStyle: CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 40,
}
