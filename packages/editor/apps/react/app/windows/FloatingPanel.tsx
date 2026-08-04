"use client"

import { WindowSurface } from "@app/windows/WindowSurface.bespoke"
import { useDraggableWindow } from "@app/windows/hooks/use-draggable-window"
import { usePaletteStack, usePaletteZIndex } from "@app/windows/hooks/use-palette-stack"
import { useCallback, useEffect } from "react"

import type { Rect } from "@seldon/components/utils/resize"
import type { PointerEvent, ReactNode } from "react"

/** Wiring a floating panel hands to its title bar so a press starts the drag. */
export interface FloatingPanelApi {
  startDrag: (event: PointerEvent) => void
}

/**
 * Where the panel opens. `center` places it in the middle of the viewport;
 * `right` docks it against the right edge near the top, matching where the
 * detached properties sidebar came from.
 */
export type FloatingPanelPlacement = "center" | "right"

/** Gap from the viewport edges when a panel opens against the right edge. */
const RIGHT_PLACEMENT_MARGIN = 16

/** Gap from the top of the viewport when a panel opens against the right edge. */
const RIGHT_PLACEMENT_TOP = 56

/** Debounce for persisting the rect while dragging or resizing, in ms. */
const RECT_PERSIST_DELAY = 300

/** The widest a palette may be dragged, as a multiple of its minimum width. */
const MAX_WIDTH_RATIO = 2.5

interface FloatingPanelProps {
  initialWidth: number
  initialHeight: number
  onClose: () => void
  children: (api: FloatingPanelApi) => ReactNode
  /** Identity in the palette stack, so a press can raise this palette to the front. */
  paletteId: string
  testId?: string
  closeOnClickOutside?: boolean
  placement?: FloatingPanelPlacement
  /** Saved rect to reopen at. Falls back to the placement default when null. */
  rect?: Rect | null
  /** Called after a drag or resize settles, so the caller can persist the rect. */
  onRectChange?: (rect: Rect) => void
}

/**
 * Shared shell for the editor's floating palettes. It centers the window on
 * open, owns the drag, resize, and escape wiring through `useDraggableWindow`,
 * and renders a non-modal `WindowSurface`. The caller receives `startDrag` so
 * its own header acts as the drag handle. Mounting the panel only while it is
 * open lets it recenter on each open, matching the other floating view-models.
 */
export function FloatingPanel({
  initialWidth,
  initialHeight,
  onClose,
  children,
  paletteId,
  testId,
  closeOnClickOutside = false,
  placement = "center",
  rect,
  onRectChange,
}: FloatingPanelProps) {
  const placementPosition =
    placement === "right"
      ? {
          x: window.innerWidth - initialWidth - RIGHT_PLACEMENT_MARGIN,
          y: RIGHT_PLACEMENT_TOP,
        }
      : {
          x: 0.5 * window.innerWidth - 0.5 * initialWidth,
          y: 0.5 * window.innerHeight - 0.5 * initialHeight,
        }

  const initialPosition = rect ? { x: rect.x, y: rect.y } : placementPosition
  const initialSize = rect
    ? { width: rect.width, height: rect.height }
    : { width: initialWidth, height: initialHeight }

  const {
    x,
    y,
    width,
    height,
    onResizeStart,
    onResize,
    getRect,
    moveControls,
    dragConstraints,
    minWidth,
    minHeight,
  } = useDraggableWindow({
    initialPosition,
    initialSize,
    handleClose: onClose,
  })

  const maxWidth = minWidth * MAX_WIDTH_RATIO

  const startDrag = useCallback((event: PointerEvent) => moveControls.start(event), [moveControls])

  // Join the palette stack on open (frontmost) and leave it on close, so its
  // z-index tracks its place in the stack and a press lifts it above its peers.
  const { register, unregister, raise } = usePaletteStack()
  const zIndex = usePaletteZIndex(paletteId)

  useEffect(() => {
    register(paletteId)

    return () => unregister(paletteId)
  }, [paletteId, register, unregister])

  const raiseToFront = useCallback(() => raise(paletteId), [raise, paletteId])

  // Persist the rect a short moment after a drag or resize settles, so the
  // palette reopens where the user left it without writing on every frame.
  useEffect(() => {
    if (!onRectChange) return

    let timeout: ReturnType<typeof setTimeout>

    const commit = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => onRectChange(getRect()), RECT_PERSIST_DELAY)
    }

    const unsubscribers = [
      x.on("change", commit),
      y.on("change", commit),
      width.on("change", commit),
      height.on("change", commit),
    ]

    return () => {
      clearTimeout(timeout)
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [x, y, width, height, getRect, onRectChange])

  const content = children({ startDrag })

  return (
    <WindowSurface
      onClose={onClose}
      testId={testId}
      closeOnClickOutside={closeOnClickOutside}
      x={x}
      y={y}
      width={width}
      height={height}
      moveControls={moveControls}
      dragConstraints={dragConstraints}
      onResizeStart={onResizeStart}
      onResize={onResize}
      getRect={getRect}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={maxWidth}
      zIndex={zIndex}
      onSurfacePointerDown={raiseToFront}
    >
      {content}
    </WindowSurface>
  )
}
