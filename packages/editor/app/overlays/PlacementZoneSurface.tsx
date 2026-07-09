import { CSSProperties, MouseEvent, ReactNode, Ref } from "react"

interface PlacementZoneSurfaceProps {
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
  dataTestId?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  onDoubleClick?: (event: MouseEvent<HTMLDivElement>) => void
  children?: ReactNode
}

/**
 * Interactive drop-zone band. Hit area and behavior arrive via props; the View
 * only renders the surface and forwards pointer events.
 */
export function PlacementZoneSurface({
  style,
  ref,
  dataTestId,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDoubleClick,
  children,
}: PlacementZoneSurfaceProps) {
  return (
    <div
      ref={ref}
      style={style}
      data-testid={dataTestId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  )
}
