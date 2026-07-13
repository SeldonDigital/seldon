// BESPOKE-VIEW: positions the generated toast messages above the editor chrome.
import { type CSSProperties, type ReactNode } from "react"
import { Frame } from "@seldon/components/frames/Frame"

interface ToastStackProps {
  children: ReactNode
}

const stackStyle: CSSProperties = {
  position: "fixed",
  bottom: "3rem",
  left: "50%",
  zIndex: 2147483001,
  display: "flex",
  flexDirection: "column",
  gap: "var(--sdn-gaps-compact)",
  pointerEvents: "none",
  transform: "translateX(-50%)",
}

/** Bottom-centered, vertically stacked container for toasts. */
export function ToastStack({ children }: ToastStackProps) {
  return <Frame style={stackStyle}>{children}</Frame>
}
