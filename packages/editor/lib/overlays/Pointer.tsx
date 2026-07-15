import { CSSProperties } from "react"
import { Frame } from "@seldon/components/frames/Frame"

interface PointerProps {
  style: CSSProperties
}

/** Small circular endpoint marker for an insertion indicator. */
export function Pointer({ style }: PointerProps) {
  return <Frame style={style} />
}
