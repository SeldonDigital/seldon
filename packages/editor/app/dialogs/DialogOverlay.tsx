import { CSSProperties, ReactNode } from "react"
import { createPortal } from "react-dom"
import {
  BoundingBox,
  DragControls,
  MotionValue,
  PanInfo,
  motion,
} from "framer-motion"
import { Backdrop } from "@seldon/components/custom-components"

type ResizeSide =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

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
  onResize: (side: ResizeSide, info: PanInfo) => void
  resizeSides?: readonly ResizeSide[]
}

/**
 * Draggable, resizable dialog surface. Renders a full-area backdrop that closes
 * on click and a fixed, motion-driven surface, both portaled to the document
 * body. All drag and resize wiring arrives via props, matching
 * `FloatingPanelSurface`; this View only renders the surface and edge handles.
 *
 * The caller starts a drag from its own handle by calling `moveControls.start`.
 * Resize handles cover the `resizeSides`, defaulting to the left, right, and
 * bottom edges plus the two bottom corners for diagonal resizing.
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
  resizeSides = DEFAULT_RESIZE_SIDES,
}: DialogOverlayProps) {
  const surfaceMotionStyle = { x, y, width, height, ...surfaceStyle }

  const resizeHandles = resizeSides.map((side) => {
    const handleResize = (_event: PointerEvent, info: PanInfo) =>
      onResize(side, info)
    return (
      <motion.div
        key={side}
        onPan={handleResize}
        onPointerDown={onResizeStart}
        style={getResizeHandleStyle(side)}
      />
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

const EDGE = "0.5rem"

function getResizeHandleStyle(side: ResizeSide): CSSProperties {
  const style: CSSProperties = { position: "absolute", touchAction: "none" }

  if (side.includes("bottom")) {
    style.bottom = 0
    style.height = EDGE
  }
  if (side.includes("left")) {
    style.left = 0
    style.width = EDGE
  }
  if (side.includes("right")) {
    style.right = 0
    style.width = EDGE
  }
  if (side.includes("top")) {
    style.top = 0
    style.height = EDGE
  }

  switch (side) {
    case "top":
    case "bottom":
      style.left = EDGE
      style.right = EDGE
      style.cursor = "ns-resize"
      break
    case "left":
    case "right":
      style.top = EDGE
      style.bottom = EDGE
      style.cursor = "ew-resize"
      break
    case "top-left":
    case "bottom-right":
      style.cursor = "nwse-resize"
      break
    case "top-right":
    case "bottom-left":
      style.cursor = "nesw-resize"
      break
  }

  return style
}
