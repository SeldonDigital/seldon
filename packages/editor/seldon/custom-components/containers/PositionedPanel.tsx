import { CSSProperties, ReactNode } from "react"

interface PositionedPanelProps {
  style?: CSSProperties
  children: ReactNode
}

/** Absolutely positioned content layer driven entirely by an incoming style. */
export function PositionedPanel({ style, children }: PositionedPanelProps) {
  return <div style={style}>{children}</div>
}
