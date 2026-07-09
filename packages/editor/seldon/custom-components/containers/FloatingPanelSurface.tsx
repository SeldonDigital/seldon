import { BoundingBox, DragControls, MotionValue, motion } from "framer-motion"
import { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react"
import { HeaderPanelsClose } from "@seldon/components/chrome/elements/HeaderPanelsClose"
import {
  Rect,
  ResizeSide,
  RESIZE_SIDES,
  createResizeHandle,
  getResizeHandleStyle,
} from "../../utils/resize"

interface FloatingPanelSurfaceProps {
  x: MotionValue<number>
  y: MotionValue<number>
  width: MotionValue<number>
  height: MotionValue<number>
  moveControls: DragControls
  dragConstraints: BoundingBox
  onResizeStart: () => void
  onResize: (rect: Rect) => void
  getRect: () => Rect
  onClose: () => void
  title?: string
  testId?: string
  resizeSides?: readonly ResizeSide[]
  minWidth?: number
  minHeight?: number
  children: ReactNode
}

/**
 * Draggable, resizable panel surface. All drag and resize wiring arrives via
 * props; this View only renders the motion surface, header, and edge handles.
 * Resize handles cover the given `resizeSides` and drive `onResize` through the
 * shared resize helpers.
 */
export function FloatingPanelSurface({
  x,
  y,
  width,
  height,
  moveControls,
  dragConstraints,
  onResizeStart,
  onResize,
  getRect,
  onClose,
  title,
  testId,
  resizeSides = RESIZE_SIDES,
  minWidth,
  minHeight,
  children,
}: FloatingPanelSurfaceProps) {
  const surfaceMotionStyle = { x, y, width, height, ...surfaceStyle }

  const startDrag = (event: ReactPointerEvent) => moveControls.start(event)

  const titleProps = { children: title, style: styles.title }
  const buttonIconicProps = { onClick: onClose }

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

  return (
    <motion.div
      drag
      style={surfaceMotionStyle}
      dragControls={moveControls}
      dragMomentum={false}
      dragElastic={false}
      dragConstraints={dragConstraints}
      dragListener={false}
      data-testid={testId}
      className="variant-dialog-default"
    >
      <HeaderPanelsClose
        onPointerDown={startDrag}
        titleProps={titleProps}
        buttonIconicProps={buttonIconicProps}
      />
      {children}
      {resizeHandles}
    </motion.div>
  )
}

const surfaceStyle: CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 40,
}

const styles: Record<string, CSSProperties> = {
  title: {
    alignSelf: "center",
    color: "var(--sdn-swatch-white)",
    flex: "1 0 0",
    fontSize: "14px",
  },
}
