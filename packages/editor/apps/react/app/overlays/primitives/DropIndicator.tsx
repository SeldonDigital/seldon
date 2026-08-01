import { IndicatorDot } from "./IndicatorDot"
import { IndicatorLine } from "./IndicatorLine"

import type { CSSProperties } from "react"

const DOT_SIZE = "var(--sdn-sizes-xsmall)"

/** Hangs the dot off the start of the line, for a line that is inset from its row. */
const DOT_OFFSET = "-8px"

interface DropIndicatorProps {
  /** Accent color for both the line and the leading dot border. */
  color: string
  /** Positioning for the line, merged over the shared line base. */
  position: CSSProperties
  dotSize?: string | number
  /** Dot position along the line. Pass `0` to keep it inside a full-width line. */
  dotOffset?: string | number
}

/**
 * Drop indicator: a colored line with a leading circular dot. The line and dot
 * share one recipe; callers pass the accent color and the line's position. Used
 * by the sidebar insert/select indicators and the layer-reorder drop bands.
 */
export function DropIndicator({
  color,
  position,
  dotSize = DOT_SIZE,
  dotOffset = DOT_OFFSET,
}: DropIndicatorProps) {
  const lineStyle: CSSProperties = {
    position: "absolute",
    zIndex: 20,
    pointerEvents: "none",
    backgroundColor: color,
    ...position,
  }

  const dotStyle: CSSProperties = {
    position: "absolute",
    left: dotOffset,
    top: "0.5px",
    transform: "translateY(-50%)",
    height: dotSize,
    width: dotSize,
    borderRadius: "9999px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: color,
    backgroundColor: "var(--sdn-swatch-offBlack)",
  }

  return (
    <IndicatorLine style={lineStyle}>
      <IndicatorDot style={dotStyle} />
    </IndicatorLine>
  )
}
