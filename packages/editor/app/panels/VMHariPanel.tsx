"use client"

import { CSSProperties, PointerEvent, ReactNode, useCallback } from "react"
import { DialogHari } from "@seldon/components/modules/DialogHari"
import { useFloatingPanel } from "@app/panels/hooks/use-floating-panel"
import { PanelOverlay } from "./PanelOverlay"

interface VMHariPanelProps {
  title: string
  testId?: string
  initialWidth: number
  initialHeight: number
  onClose: () => void
  closeOnClickOutside?: boolean
  children: ReactNode
}

/**
 * Shared view-model for the floating panels. Feeds the generated `DialogHari`
 * shell: it wires the title, drag handle, and close button, and injects the
 * caller's content into the shell's content frame. It owns the drag, resize,
 * and escape wiring through `useFloatingPanel`, then renders `DialogHari` inside
 * the non-modal `PanelOverlay`. Mirrors `VMCatalogDialog`, but the panel stays
 * non-modal so the canvas remains usable.
 */
export function VMHariPanel({
  title,
  testId,
  initialWidth,
  initialHeight,
  onClose,
  closeOnClickOutside = false,
  children,
}: VMHariPanelProps) {
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
  } = useFloatingPanel({
    initialPosition: {
      x: 0.5 * window.innerWidth - 0.5 * initialWidth,
      y: 0.5 * window.innerHeight - 0.5 * initialHeight,
    },
    initialSize: { width: initialWidth, height: initialHeight },
    handleClose: onClose,
  })

  const startDrag = useCallback(
    (event: PointerEvent) => moveControls.start(event),
    [moveControls],
  )

  const barHandle = { onPointerDown: startDrag, style: styles.dragHandle }
  const dialogTitle = { children: title }
  const closeButton = { onClick: onClose }
  const contentFrame = { style: styles.content, children }

  return (
    <PanelOverlay
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
    >
      <DialogHari
        bar={barHandle}
        textTitle={dialogTitle}
        buttonIconic={closeButton}
        frame={contentFrame}
        style={styles.dialog}
      />
    </PanelOverlay>
  )
}

const styles: Record<string, CSSProperties> = {
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
