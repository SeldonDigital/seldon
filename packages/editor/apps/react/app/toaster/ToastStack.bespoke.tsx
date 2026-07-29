// BESPOKE-VIEW: hand-authored transitional View with inline token styling.
// Replace with a generated workspace component once one covers the toast stack.
import type { CSSProperties, ReactNode } from "react"

interface ToastStackProps {
  children: ReactNode
}

/** Above the canvas and its overlays, below the window layer that owns dialogs. */
const STACK_Z_INDEX = 50

const stackStyle: CSSProperties = {
  position: "absolute",
  bottom: "var(--sdn-sizes-xxlarge)",
  left: "50%",
  zIndex: STACK_Z_INDEX,
  display: "flex",
  flexDirection: "column",
  gap: "var(--sdn-gaps-compact)",
  transform: "translateX(-50%)",
}

/** Bottom-centered, vertically stacked container for toasts. */
export function ToastStack({ children }: ToastStackProps) {
  return <div style={stackStyle}>{children}</div>
}
