// BESPOKE-VIEW: hand-authored framer-motion floating window built on motion.div.
// It renders either a draggable, resizable window or a centered, content-sized
// modal. No generated component covers this chrome. framer-motion has no 1:1
// equivalent on other platforms, so this shell is reimplemented per platform
// rather than ported like the class-free overlay primitives.
import { useChromeTheme } from "@app/editor/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@app/editor/hooks/use-system-color-scheme"
import {
  RESIZE_SIDES,
  createResizeHandle,
  getResizeHandleStyle,
} from "@seldon/components/utils/resize"
import { motion } from "framer-motion"
import { useCallback, useRef } from "react"
import { createPortal } from "react-dom"

import type { Rect, ResizeSide } from "@seldon/components/utils/resize"
import type { BoundingBox, DragControls, MotionValue } from "framer-motion"
import type {
  CSSProperties,
  MouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  Ref,
} from "react"

interface WindowSurfaceProps {
  x: MotionValue<number>
  y: MotionValue<number>
  moveControls: DragControls
  onClose: () => void
  children: ReactNode
  testId?: string
  modal?: boolean
  closeOnClickOutside?: boolean
  preventInteractionOutside?: boolean
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
  maxWidth?: number
  /**
   * Live z-index for a palette surface, so a click can lift it above its peers.
   * Only the plain palette surface honors it; dialogs and anchored cards keep
   * their own bands.
   */
  zIndex?: number
  /** Fires on a palette-surface press, so the caller can raise it to the front. */
  onSurfacePointerDown?: (event: ReactPointerEvent) => void
  // Render a centered modal whose surface hugs its content. `x`/`y` act as a
  // drag offset from center, the viewport bounds the drag, and no resize handles
  // are rendered.
  contentSized?: boolean
  /**
   * Where the surface portals. Defaults to `document.body`, which floats it over the
   * whole editor. A canvas badge card passes the canvas layer instead, with `anchored`,
   * so it sits in that layer and the sidebar clips it like the badges.
   */
  portalTarget?: HTMLElement | null
  /**
   * Position the surface absolutely inside its portal target rather than fixed to the
   * viewport. `x`/`y` are then read in the target's own space. Used with `portalTarget`
   * so a badge card is clipped by the canvas layer instead of drawing over the chrome.
   */
  anchored?: boolean
  /**
   * The surface itself, including its resize handles. A non-modal caller that
   * dismisses on an outside press needs it to tell its own surface from elsewhere,
   * since it renders no backdrop to catch the press for it.
   */
  surfaceRef?: Ref<HTMLDivElement>
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
  maxWidth,
  contentSized = false,
  portalTarget,
  anchored = false,
  surfaceRef,
  zIndex,
  onSurfacePointerDown,
}: WindowSurfaceProps) {
  // The portal mounts on document.body, outside the chrome root that scopes the
  // editor theme and mode, so re-apply both here to match the editor interface.
  const chromeTheme = useChromeTheme()
  const resolvedMode = useResolvedInterfaceMode()
  const overlayRef = useRef<HTMLDivElement>(null)

  const stopPropagation = useCallback((event: MouseEvent) => event.stopPropagation(), [])

  const showBackdrop = modal || closeOnClickOutside || preventInteractionOutside
  const backdropClick = modal || closeOnClickOutside ? onClose : undefined

  // Dialogs sit above palettes: a modal or content-sized surface is a dialog, and a plain
  // draggable surface is a palette or a badge card. The two take separate z-index bands so a
  // dialog is never obscured by a palette left open behind it.
  const isDialog = modal || contentSized

  if (contentSized) {
    // The centered overlay both backs the modal and bounds the drag, so the
    // surface stays on screen. Clicking the overlay closes; clicking the surface
    // does not.
    const contentSurfaceStyle = { x, y, ...styles.contentSurface }

    return createPortal(
      <div data-theme={chromeTheme} data-mode={resolvedMode} style={styles.scope}>
        <div ref={overlayRef} onClick={backdropClick} style={styles.centerOverlay}>
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

  const surfaceStyle = anchored
    ? styles.anchoredSurface
    : isDialog
      ? styles.dialogSurface
      : styles.surface
  // Only a plain palette surface takes a live z-index and raise-on-press; dialogs
  // and anchored cards keep their own bands.
  const isPalette = !isDialog && !anchored
  const raisedZ = isPalette && zIndex !== undefined ? zIndex : undefined
  const surfaceMotionStyle =
    raisedZ === undefined
      ? { x, y, width, height, ...surfaceStyle }
      : { x, y, width, height, ...surfaceStyle, zIndex: raisedZ }
  const surfacePointerDown = isPalette ? onSurfacePointerDown : undefined
  const backdropStyle = isDialog ? styles.dialogBackdrop : styles.backdrop
  const backdrop = showBackdrop ? <div onClick={backdropClick} style={backdropStyle} /> : null

  // Anchored inside the canvas layer, a press bubbles to the canvas click handler; stop it
  // so interacting with the card never reads as a canvas click. A body-portaled surface has
  // no such parent to reach, so it keeps the default.
  const surfaceClick = anchored ? stopPropagation : undefined
  const target = portalTarget ?? document.body

  const resizeHandles =
    onResize && getRect
      ? resizeSides.map((side) => {
          // The width cap is held per side so a left-edge drag keeps its right edge fixed,
          // shifting x, while a right-edge drag leaves x alone. The min cap already lives in
          // the resize math; the max is applied here since only this View knows the side.
          const handleResize = (rect: Rect) => onResize(clampResizeWidth(rect, side, maxWidth))
          const { onPointerDown } = createResizeHandle({
            side,
            getRect,
            onResize: handleResize,
            minWidth,
            minHeight,
            onStart: onResizeStart,
          })

          return <div key={side} onPointerDown={onPointerDown} style={getResizeHandleStyle(side)} />
        })
      : null

  return createPortal(
    <div data-theme={chromeTheme} data-mode={resolvedMode} style={styles.scope}>
      {backdrop}
      <motion.div
        ref={surfaceRef}
        drag
        dragControls={moveControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={false}
        dragConstraints={dragConstraints}
        onClick={surfaceClick}
        onPointerDownCapture={surfacePointerDown}
        style={surfaceMotionStyle}
        data-testid={testId}
      >
        {children}
        {resizeHandles}
      </motion.div>
    </div>,
    target,
  )
}

/**
 * Cap a resized window's width, holding the edge opposite the drag in place. A left-edge
 * drag keeps the right edge fixed, so the cap shifts x; a right-edge drag keeps the left
 * edge, so x is untouched. The rect is returned unchanged when no cap is set or met.
 */
function clampResizeWidth(rect: Rect, side: ResizeSide, maxWidth?: number): Rect {
  if (maxWidth === undefined || rect.width <= maxWidth) return rect

  const x = side.includes("left") ? rect.x + (rect.width - maxWidth) : rect.x

  return { ...rect, x, width: maxWidth }
}

const styles: Record<string, CSSProperties> = {
  // The scope only carries the theme/mode attributes; `display: contents` keeps
  // it out of layout so the fixed backdrop and surface position as before.
  scope: {
    display: "contents",
  },
  // Palette band (30/40): a non-modal draggable surface and its optional backdrop.
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
  // Absolute inside the canvas layer, so `x`/`y` read in that layer's space and the sidebar
  // clips the surface as it does the badges, rather than the surface floating over the chrome.
  anchoredSurface: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 40,
  },
  // Dialog band (50/60): above the palette band, so a dialog is never hidden behind a
  // palette that stays open behind it. Shared by modal surfaces and the content-sized modal.
  dialogBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
  },
  dialogSurface: {
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 60,
  },
  // Content-sized modal: a fixed, flex-centered overlay holds a surface that
  // hugs its authored content and drags as an offset from center.
  centerOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentSurface: {
    width: "fit-content",
    height: "fit-content",
    zIndex: 60,
  },
}
