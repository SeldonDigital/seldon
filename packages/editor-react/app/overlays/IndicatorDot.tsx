import { Frame } from "@seldon/components/frames/Frame"
import { CSSProperties } from "react"

interface IndicatorDotProps {
  style: CSSProperties
}

/** Small circular endpoint marker for a drop/insertion indicator line. */
export function IndicatorDot({ style }: IndicatorDotProps) {
  return <Frame style={style} />
}
