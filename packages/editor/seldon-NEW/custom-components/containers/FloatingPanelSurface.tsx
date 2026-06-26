import {
  BoundingBox,
  DragControls,
  MotionValue,
  PanInfo,
  motion,
} from "framer-motion"
import { CSSProperties, ReactNode } from "react"
import { HeaderPanelsClose } from "@seldon/components/chrome/elements/HeaderPanelsClose"

type ResizeSide =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"

const RESIZE_SIDES: readonly ResizeSide[] = [
  "top",
  "right",
  "bottom",
  "left",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
]

interface FloatingPanelSurfaceProps {
  x: MotionValue<number>
  y: MotionValue<number>
  width: MotionValue<number>
  height: MotionValue<number>
  moveControls: DragControls
  dragConstraints: BoundingBox
  onResizeStart: () => void
  onResize: (side: ResizeSide, info: PanInfo) => void
  onClose: () => void
  title?: string
  testId?: string
  children: ReactNode
}

/**
 * Draggable, resizable panel surface. All drag and resize wiring arrives via
 * props; this View only renders the motion surface, header, and edge handles.
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
  onClose,
  title,
  testId,
  children,
}: FloatingPanelSurfaceProps) {
  return (
    <motion.div
      drag
      style={{
        x,
        y,
        width,
        height,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 40,
      }}
      dragControls={moveControls}
      dragMomentum={false}
      dragElastic={false}
      dragConstraints={dragConstraints}
      dragListener={false}
      data-testid={testId}
      className="variant-dialog-default"
    >
      <HeaderPanelsClose
        onPointerDown={(event) => moveControls.start(event)}
        titleProps={{
          children: title,
          style: styles.title,
        }}
        buttonIconicProps={{
          onClick: onClose,
        }}
      />
      {children}
      {RESIZE_SIDES.map((side) => (
        <motion.div
          key={side}
          onPan={(_event, info) => onResize(side, info)}
          onPointerDown={onResizeStart}
          style={getResizeHandleStyle(side)}
        />
      ))}
    </motion.div>
  )
}

const styles: Record<string, CSSProperties> = {
  title: {
    alignSelf: "center",
    color: "white",
    flex: "1 0 0",
    fontSize: "14px",
  },
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
