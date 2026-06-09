import { CSSProperties, ReactNode } from "react"

interface InsertIndicatorLineProps {
  style: CSSProperties
  children?: ReactNode
}

/** Insertion line. May host an endpoint marker as its child. */
export function InsertIndicatorLine({ style, children }: InsertIndicatorLineProps) {
  return <div style={style}>{children}</div>
}
