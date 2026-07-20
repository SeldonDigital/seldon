import { CSSProperties, ReactNode } from "react"
import { Frame } from "@seldon/components/frames/Frame"

interface IndicatorLineProps {
  style: CSSProperties
  children?: ReactNode
}

/** Indicator line. May host an endpoint marker as its child. */
export function IndicatorLine({ style, children }: IndicatorLineProps) {
  return <Frame style={style}>{children}</Frame>
}
