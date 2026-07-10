import { BoundingBox, DragControls, MotionValue, motion } from "framer-motion"
import { CSSProperties, ReactNode } from "react"
import { createPortal } from "react-dom"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@lib/hooks/use-system-color-scheme"
import {
  RESIZE_SIDES,
  Rect,
  ResizeSide,
  createResizeHandle,
  getResizeHandleStyle,
} from "@seldon/components/utils/resize"

interface PaletteOverlayProps {
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
  testId?: string
  resizeSides?: readonly ResizeSide[]
  minWidth?: number
  minHeight?: number
  closeOnClickOutside?: boolean
  preventInteractionOutside?: boolean
  children: ReactNode
}

/**
 * Draggable, resizable panel surface. All drag and resize wiring arrives via
 * props; this View renders the motion surface, its children, and the edge
 * handles, all portaled to the document body. Because the portal mounts outside
 * the chrome root, it re-applies the editor theme and mode. It is the non-modal
 * twin of `DialogOverlay`: it stays non-modal unless `closeOnClickOutside` or
 * `preventInteractionOutside` asks for a backdrop.
 */
export function PaletteOverlay({
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
  testId,
  resizeSides = RESIZE_SIDES,
  minWidth,
  minHeight,
  closeOnClickOutside = false,
  preventInteractionOutside = false,
  children,
}: PaletteOverlayProps) {
  // The portal mounts on document.body, outside the chrome root that scopes the
  // editor theme and mode, so re-apply both here to match the editor interface.
  const { chromeTheme } = useEditorConfig()
  const resolvedMode = useResolvedInterfaceMode()

  const surfaceMotionStyle = { x, y, width, height, ...surfaceStyle }

  const showBackdrop = closeOnClickOutside || preventInteractionOutside
  const backdropClick = closeOnClickOutside ? onClose : undefined
  const backdrop = showBackdrop ? (
    <div onClick={backdropClick} style={styles.backdrop} />
  ) : null

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
      <div
        key={side}
        onPointerDown={onPointerDown}
        style={getResizeHandleStyle(side)}
      />
    )
  })

  return createPortal(
    <div data-theme={chromeTheme} data-mode={resolvedMode} style={styles.scope}>
      {backdrop}
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
        {children}
        {resizeHandles}
      </motion.div>
    </div>,
    document.body,
  )
}

const surfaceStyle: CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 40,
}

const styles: Record<string, CSSProperties> = {
  // The scope only carries the theme/mode attributes; `display: contents` keeps
  // it out of layout so the fixed backdrop and surface position as before.
  scope: {
    display: "contents",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 30,
  },
}
