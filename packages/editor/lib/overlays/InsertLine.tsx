import { COLORS } from "@lib/helpers/colors"
import { CSSProperties } from "react"
import { InsertIndicatorLine } from "./InsertIndicatorLine"
import { Pointer } from "./Pointer"

const DOT_SIZE = "var(--sdn-sizes-xsmall)"

interface InsertLineProps {
  /** Accent color for both the line and the leading dot border. */
  color: string
  /** Positioning for the line, merged over the shared line base. */
  position: CSSProperties
  dotSize?: string | number
}

/**
 * Insertion indicator: a colored line with a leading circular dot. The line and
 * dot share one recipe; callers pass the accent color and the line's position.
 * Used by the sidebar insert/select indicators and the layer-reorder drop bands.
 */
export function InsertLine({
  color,
  position,
  dotSize = DOT_SIZE,
}: InsertLineProps) {
  const lineStyle: CSSProperties = {
    position: "absolute",
    zIndex: 20,
    pointerEvents: "none",
    backgroundColor: color,
    ...position,
  }

  const dotStyle: CSSProperties = {
    position: "absolute",
    left: "-8px",
    top: "0.5px",
    transform: "translateY(-50%)",
    height: dotSize,
    width: dotSize,
    borderRadius: "9999px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: color,
    backgroundColor: COLORS.charcoal[500],
  }

  return (
    <InsertIndicatorLine style={lineStyle}>
      <Pointer style={dotStyle} />
    </InsertIndicatorLine>
  )
}
