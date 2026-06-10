import { CSSProperties, ReactNode } from "react"

interface OverlayLayerProps {
  style?: CSSProperties
  children?: ReactNode
}

const baseStyle: CSSProperties = { position: "absolute", inset: 0 }

/** Edge-to-edge overlay layer. Additional style merges over the inset base. */
export function OverlayLayer({ style, children }: OverlayLayerProps) {
  return <div style={{ ...baseStyle, ...style }}>{children}</div>
}
