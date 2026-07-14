import { CSSProperties } from "react"
import { Frame } from "@seldon/components/frames/Frame"

interface CanvasOutlineProps {
  style: CSSProperties
}

/** Positioned outline box for selection, hover, and wireframe overlays. */
export function CanvasOutline({ style }: CanvasOutlineProps) {
  return <Frame style={style} />
}
