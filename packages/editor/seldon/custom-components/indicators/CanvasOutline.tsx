import { CSSProperties } from "react"

interface CanvasOutlineProps {
  style: CSSProperties
}

/** Positioned outline box for selection, hover, and wireframe overlays. */
export function CanvasOutline({ style }: CanvasOutlineProps) {
  return <div style={style} />
}
