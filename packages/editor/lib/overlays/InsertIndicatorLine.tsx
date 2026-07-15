import { CSSProperties, ReactNode } from "react"
import { Frame } from "@seldon/components/frames/Frame"

interface InsertIndicatorLineProps {
  style: CSSProperties
  children?: ReactNode
}

/** Insertion line. May host an endpoint marker as its child. */
export function InsertIndicatorLine({
  style,
  children,
}: InsertIndicatorLineProps) {
  return <Frame style={style}>{children}</Frame>
}
