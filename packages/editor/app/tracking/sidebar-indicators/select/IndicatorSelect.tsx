import { COLORS } from "@lib/helpers/colors"
import { Placement } from "@lib/types"
import { FC } from "react"
import { CSSProperties } from "react"
import { useIndentation } from "../../../sidebars/hooks/use-indentation"
import {
  CanvasOutline,
  InsertIndicatorLine,
  Pointer,
} from "@seldon/components/custom-components"
import { calculateIndicatorPosition } from "../helpers/calculate-indicator-position"
import { SIDEBAR_INDICATOR_DOT_SIZE } from "../sidebar-indicators.bespoke"

type IndicatorSelectProps = {
  placement: Placement
}

/**
 * Visual indicator for select tool showing where items will be dropped during drag operations.
 */
export const IndicatorSelect: FC<IndicatorSelectProps> = ({ placement }) => {
  const indentation = useIndentation()

  // "inside" nests the dragged object, so outline the whole target row like a
  // selection instead of drawing an edge line.
  if (placement === "inside") {
    return (
      <CanvasOutline
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
          border: `1px solid ${COLORS.primary[600]}`,
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      />
    )
  }

  const position = calculateIndicatorPosition(placement, indentation)

  const lineStyle: CSSProperties = {
    position: "absolute",
    zIndex: 20,
    pointerEvents: "none",
    backgroundColor: COLORS.primary[600],
    ...position,
  }

  const circleStyle: CSSProperties = {
    position: "absolute",
    height: SIDEBAR_INDICATOR_DOT_SIZE,
    width: SIDEBAR_INDICATOR_DOT_SIZE,
    borderRadius: "9999px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.charcoal[500],
  }

  const dotStyle: CSSProperties = {
    left: "-8px",
    top: "0.5px",
    transform: "translateY(-50%)",
    ...circleStyle,
  }

  return (
    <InsertIndicatorLine style={lineStyle}>
      <Pointer style={dotStyle} />
    </InsertIndicatorLine>
  )
}
