import { CSSProperties, MouseEventHandler, ReactNode } from "react"

interface PositionedPanelProps {
  style?: CSSProperties
  children: ReactNode
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
}

/** Absolutely positioned content layer driven entirely by an incoming style. */
export function PositionedPanel({
  style,
  children,
  onMouseLeave,
}: PositionedPanelProps) {
  return (
    <div style={style} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  )
}
