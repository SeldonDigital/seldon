// BESPOKE-VIEW: hand-authored framer-motion floating window built on motion.div.
// It renders either a draggable, resizable window or a centered, content-sized
// modal. No generated component covers this chrome. framer-motion has no 1:1
// equivalent on other platforms, so this shell is reimplemented per platform
// rather than ported like the class-free overlay primitives.
import { BoundingBox, DragControls, MotionValue, motion } from "framer-motion"
import {
  CSSProperties,
  MouseEvent,
  ReactNode,
  useCallback,
  useRef,
} from "react"
import { createPortal } from "react-dom"
import { useEditorConfig } from "@app/editor/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import {
  RESIZE_SIDES,
  Rect,
  ResizeSide,
  createResizeHandle,
  getResizeHandleStyle,
} from "@seldon/components/utils/resize"

interface WindowSurfaceProps {
  x: MotionValue<number>
  y: MotionValue<number>
  moveControls: DragControls
  onClose: () => void
  testId?: string
  modal?: boolean
  closeOnClickOutside?: boolean
  preventInteractionOutside?: boolean
  children: ReactNode
  // Resizable-window wiring. Required unless `contentSized` is set, where the
  // surface sizes to its content, centers itself, and cannot resize.
  width?: MotionValue<number>
  height?: MotionValue<number>
  dragConstraints?: BoundingBox
  onResizeStart?: () => void
  onResize?: (rect: Rect) => void
  getRect?: () => Rect
  resizeSides?: readonly ResizeSide[]
  minWidth?: number
  minHeight?: number
  // Render a centered modal whose surface hugs its content. `x`/`y` act as a
  // drag offset from center, the viewport bounds the drag, and no resize handles
  // are rendered.
  contentSized?: boolean
}

/**
 * Floating window surface shared by dialogs and palettes. All drag and resize
 * wiring arrives via props; this View renders the motion surface, its children,
 * and any edge handles, all portaled to the document body. Because the portal
 * mounts outside the chrome root, it re-applies the editor theme and mode.
 *
 * `modal` renders a closing backdrop for dialog surfaces. Palettes stay non-modal
 * unless `closeOnClickOutside` or `preventInteractionOutside` asks for a backdrop.
 *
 * `contentSized` switches to a centered modal that hugs its content and drags
 * from its title bar without resizing, for authored dialogs that carry their own
 * size.
 */
export function WindowSurface({
  x,
  y,
  moveControls,
  onClose,
  testId,
  modal = false,
  closeOnClickOutside = false,
  preventInteractionOutside = false,
  children,
  width,
  height,
  dragConstraints,
  onResizeStart,
  onResize,
  getRect,
  resizeSides = RESIZE_SIDES,
  minWidth,
  minHeight,
  contentSized = false,
}: WindowSurfaceProps) {
  // The portal mounts on document.body, outside the chrome root that scopes the
  // editor theme and mode, so re-apply both here to match the editor interface.
  const { chromeTheme } = useEditorConfig()
  const resolvedMode = useResolvedInterfaceMode()
  const overlayRef = useRef<HTMLDivElement>(null)

  const stopPropagation = useCallback(
    (event: MouseEvent) => event.stopPropagation(),
    [],
  )

  const showBackdrop = modal || closeOnClickOutside || preventInteractionOutside
  const backdropClick = modal || closeOnClickOutside ? onClose : undefined

  if (contentSized) {
    // The centered overlay both backs the modal and bounds the drag, so the
    // surface stays on screen. Clicking the overlay closes; clicking the surface
    // does not.
    const contentSurfaceStyle = { x, y, ...styles.contentSurface }
    return createPortal(
      <div
        data-theme={chromeTheme}
        data-mode={resolvedMode}
        style={styles.scope}
      >
        <div
          ref={overlayRef}
          onClick={backdropClick}
          style={styles.centerOverlay}
        >
          <motion.div
            drag
            dragControls={moveControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={false}
            dragConstraints={overlayRef}
            onClick={stopPropagation}
            style={contentSurfaceStyle}
            data-testid={testId}
          >
            {children}
          </motion.div>
        </div>
      </div>,
      document.body,
    )
  }

  const surfaceMotionStyle = { x, y, width, height, ...styles.surface }
  const backdrop = showBackdrop ? (
    <div onClick={backdropClick} style={styles.backdrop} />
  ) : null

  const resizeHandles =
    onResize && getRect
      ? resizeSides.map((side) => {
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
      : null

  return createPortal(
    <div data-theme={chromeTheme} data-mode={resolvedMode} style={styles.scope}>
      {backdrop}
      <motion.div
        drag
        dragControls={moveControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={false}
        dragConstraints={dragConstraints}
        style={surfaceMotionStyle}
        data-testid={testId}
      >
        {children}
        {resizeHandles}
      </motion.div>
    </div>,
    document.body,
  )
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
  surface: {
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 40,
  },
  // Content-sized modal: a fixed, flex-centered overlay holds a surface that
  // hugs its authored content and drags as an offset from center.
  centerOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentSurface: {
    width: "fit-content",
    height: "fit-content",
    zIndex: 40,
  },
}
