import { CSSProperties } from "react"

interface PointerProps {
  style: CSSProperties
}

/** Small circular endpoint marker for an insertion indicator. */
export function Pointer({ style }: PointerProps) {
  return <div style={style} />
}
