import { CSSProperties, ReactNode } from "react"

interface ToastStackProps {
  children: ReactNode
}

const stackStyle: CSSProperties = {
  position: "absolute",
  bottom: "3rem",
  left: "50%",
  zIndex: 50,
  display: "flex",
  flexDirection: "column",
  gap: "var(--sdn-gaps-compact)",
  transform: "translateX(-50%)",
}

/** Bottom-centered, vertically stacked container for toasts. */
export function ToastStack({ children }: ToastStackProps) {
  return <div style={stackStyle}>{children}</div>
}
