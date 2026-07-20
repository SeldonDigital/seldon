import { Frame } from "@seldon/components/frames/Frame"
import { CSSProperties } from "react"

interface OutlineBoxProps {
  style: CSSProperties
}

/** Positioned outline box for selection, hover, and wireframe overlays. */
export function OutlineBox({ style }: OutlineBoxProps) {
  return <Frame style={style} />
}
