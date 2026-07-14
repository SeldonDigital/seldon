import { CSSProperties, ReactNode } from "react"
import { Frame } from "@seldon/components/frames/Frame"

interface OverlayLayerProps {
  style?: CSSProperties
  children?: ReactNode
}

const baseStyle: CSSProperties = { position: "absolute", inset: 0 }

/** Edge-to-edge overlay layer. Additional style merges over the inset base. */
export function OverlayLayer({ style, children }: OverlayLayerProps) {
  const layerStyle = { ...baseStyle, ...style }
  return <Frame style={layerStyle}>{children}</Frame>
}
