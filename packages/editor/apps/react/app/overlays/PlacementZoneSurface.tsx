import { Frame } from "@seldon/components/frames/Frame"
import { CSSProperties, MouseEvent, ReactNode, Ref } from "react"

interface PlacementZoneSurfaceProps {
  style?: CSSProperties
  ref?: Ref<HTMLElement>
  dataTestId?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onDoubleClick?: (event: MouseEvent<HTMLElement>) => void
  children?: ReactNode
}

/**
 * Interactive drop-zone band. Hit area and behavior arrive via props; the View
 * only renders the surface and forwards pointer events. The higher-level
 * `PlacementZone` feature component composes this primitive.
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
    <Frame
      ref={ref}
      style={style}
      data-testid={dataTestId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </Frame>
  )
}
