import { CSSProperties, ReactNode, useRef } from "react"
import { createPortal } from "react-dom"
import { DragControls, motion } from "framer-motion"
import { Backdrop } from "./Backdrop"

interface ModalOverlayProps {
  onClose: () => void
  children: ReactNode
  dragControls?: DragControls
}

/**
 * Centered modal overlay. Renders a full-area backdrop that closes on click and
 * centers its child surface, both portaled to the document body. The centering
 * layer ignores pointer events so clicks outside the surface reach the backdrop.
 *
 * When `dragControls` is provided the surface becomes draggable within the
 * viewport. The caller starts a drag from its own handle by calling
 * `dragControls.start(event)`.
 */
export function ModalOverlay({
  onClose,
  children,
  dragControls,
}: ModalOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const surface =
    dragControls != null ? (
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={false}
        dragConstraints={overlayRef}
        style={surfaceStyle}
      >
        {children}
      </motion.div>
    ) : (
      <div style={surfaceStyle}>{children}</div>
    )

  return createPortal(
    <>
      <Backdrop onClick={onClose} style={backdropStyle} />
      <div ref={overlayRef} style={overlayStyle}>
        {surface}
      </div>
    </>,
    document.body,
  )
}

const backdropStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 30,
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 40,
  pointerEvents: "none",
}

const surfaceStyle: CSSProperties = {
  pointerEvents: "auto",
}
