import { CSSProperties, MouseEvent, ReactNode, Ref } from "react"

interface PropertyControlSurfaceProps {
  containerRef?: Ref<HTMLDivElement>
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  containerStyle?: CSSProperties
  wrapperStyle?: CSSProperties
  innerStyle?: CSSProperties
  children: ReactNode
}

/** Nested surface that frames a property combobox and its options popover. */
export function PropertyControlSurface({
  containerRef,
  onClick,
  containerStyle,
  wrapperStyle,
  innerStyle,
  children,
}: PropertyControlSurfaceProps) {
  return (
    <div ref={containerRef} onClick={onClick} style={containerStyle}>
      <div style={wrapperStyle}>
        <div style={innerStyle}>{children}</div>
      </div>
    </div>
  )
}
