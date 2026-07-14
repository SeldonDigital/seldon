// BESPOKE-VIEW: canvas root surface. Carries the canvas id and pins the chrome
// theme via data-theme so board rendering reads authored swatch values.
import { CSSProperties, MouseEventHandler, ReactNode } from "react"

interface CanvasSurfaceProps {
  style?: CSSProperties
  dataTheme: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onMouseMove?: MouseEventHandler<HTMLDivElement>
  children?: ReactNode
}

/** Fixed canvas root. Hit handling and chrome theme scoping arrive via props. */
export function CanvasSurface({
  style,
  dataTheme,
  onClick,
  onMouseMove,
  children,
}: CanvasSurfaceProps) {
  return (
    <div
      id="canvas"
      style={style}
      data-theme={dataTheme}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  )
}
