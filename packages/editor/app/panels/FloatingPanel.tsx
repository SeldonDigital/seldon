import { CSSProperties } from "react"
import { createPortal } from "react-dom"
import { useHotkeys } from "react-hotkeys-hook"
import { useFloatingPanel } from "./hooks/use-floating-panel"
import {
  Backdrop,
  FloatingPanelSurface,
} from "@seldon/components/custom-components"
import { PANEL_INITIAL_HEIGHT, PANEL_INITIAL_WIDTH } from "../constants"

export type FloatingPanelProps = {
  handleClose: () => void
  children: React.ReactNode
  initialPosition?: { x?: number; y?: number }
  initialWidth?: number
  initialHeight?: number
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
  preventInteractionOutside?: boolean
  title?: string
  testId?: string
  isOpen?: boolean
}

export function FloatingPanel({
  handleClose,
  children,
  initialPosition = {},
  initialWidth = PANEL_INITIAL_WIDTH,
  initialHeight = PANEL_INITIAL_HEIGHT,
  closeOnClickOutside = false,
  closeOnEscape = true,
  preventInteractionOutside = false,
  title,
  testId,
  isOpen = true,
}: FloatingPanelProps) {
  const {
    x,
    y,
    width,
    height,
    handleResizeStart,
    handleResize,
    moveControls,
    dragConstraints,
  } = useFloatingPanel({
    initialPosition: {
      x: initialPosition.x ?? 0.5 * window.innerWidth - 0.5 * initialWidth,
      y: initialPosition.y ?? 0.5 * window.innerHeight - 0.5 * initialHeight,
    },
    initialSize: { width: initialWidth, height: initialHeight },
    handleClose,
    closeOnEscape,
  })

  useHotkeys("esc", handleClose, { enabled: isOpen })

  if (!isOpen) return null

  return (
    <>
      {(closeOnClickOutside || preventInteractionOutside) && (
        <Backdrop
          onClick={closeOnClickOutside ? handleClose : undefined}
          style={overlayStyle}
        />
      )}
      {createPortal(
        <FloatingPanelSurface
          x={x}
          y={y}
          width={width}
          height={height}
          moveControls={moveControls}
          dragConstraints={dragConstraints}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
          onClose={handleClose}
          title={title}
          testId={testId}
        >
          {children}
        </FloatingPanelSurface>,
        document.body,
      )}
    </>
  )
}

const overlayStyle: CSSProperties = { position: "fixed", inset: 0, zIndex: 30 }
