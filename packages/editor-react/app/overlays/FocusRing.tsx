import { Frame } from "@seldon/components/frames/Frame"
import { CSSProperties } from "react"

interface FocusRingProps {
  style: CSSProperties
}

/** Fixed, top-most ring drawn around the focused element. Position and size arrive via style. */
export function FocusRing({ style }: FocusRingProps) {
  return (
    <Frame className="editor-focus-ring" style={style} aria-hidden="true" />
  )
}
