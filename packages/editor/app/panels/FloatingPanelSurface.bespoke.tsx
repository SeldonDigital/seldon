// BESPOKE-VIEW: hand-authored draggable, resizable panel surface for the editor
// floating panels. Wraps the generated `DialogHari` shell with Framer Motion
// drag plus the shared resize helpers.
import { BoundingBox, DragControls, MotionValue, motion } from "framer-motion"
import { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react"
import { DialogHari } from "@seldon/components/modules/DialogHari"
import {
  Rect,
  ResizeSide,
  RESIZE_SIDES,
  createResizeHandle,
  getResizeHandleStyle,
} from "@seldon/components/utils/resize"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@lib/hooks/use-system-color-scheme"

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
 * props; this View renders the motion surface, the generated `DialogHari` shell,
 * and the edge handles. The title bar drags, the close button dismisses, and the
 * content frame holds the children. The surface portals to the document body, so
 * it re-applies the editor theme and mode to match the interface. Resize handles
 * cover the given `resizeSides` and drive `onResize` through the shared helpers.
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
  // The portal mounts on document.body, outside the chrome root that scopes the
  // editor theme and mode, so re-apply both here to match the editor interface.
  const { chromeTheme } = useEditorConfig()
  const resolvedMode = useResolvedInterfaceMode()

  const surfaceMotionStyle = { x, y, width, height, ...surfaceStyle }

  const startDrag = (event: ReactPointerEvent) => moveControls.start(event)

  const barHandle = { onPointerDown: startDrag, style: styles.dragHandle }
  const dialogTitle = { children: title }
  const closeButton = { onClick: onClose }
  const contentFrame = { style: styles.content, children }

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
    <div data-theme={chromeTheme} data-mode={resolvedMode} style={styles.scope}>
      <motion.div
        drag
        style={surfaceMotionStyle}
        dragControls={moveControls}
        dragMomentum={false}
        dragElastic={false}
        dragConstraints={dragConstraints}
        dragListener={false}
        data-testid={testId}
      >
        <DialogHari
          bar={barHandle}
          textTitle={dialogTitle}
          buttonIconic={closeButton}
          frame={contentFrame}
          style={styles.dialog}
        />
        {resizeHandles}
      </motion.div>
    </div>
  )
}

// The scope only carries the theme/mode attributes; `display: contents` keeps
// it out of layout so the fixed surface positions as before.
const scopeStyle: CSSProperties = { display: "contents" }

const surfaceStyle: CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 40,
}

const styles: Record<string, CSSProperties> = {
  scope: scopeStyle,
  dialog: {
    width: "100%",
    height: "100%",
  },
  dragHandle: {
    cursor: "grab",
  },
  content: {
    minHeight: 0,
  },
}
