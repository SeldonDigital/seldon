import { CSSProperties } from "react"
import { Frame } from "@seldon/components/frames/Frame"

interface OutlineBoxProps {
  style: CSSProperties
}

/** Positioned outline box for selection, hover, and wireframe overlays. */
export function OutlineBox({ style }: OutlineBoxProps) {
  return <Frame style={style} />
}
