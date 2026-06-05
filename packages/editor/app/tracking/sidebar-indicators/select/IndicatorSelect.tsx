import { Placement } from "@lib/types"
import { COLORS } from "@lib/helpers/colors"
import { FC } from "react"
import { CSSProperties } from "react"
import { useIndentation } from "../../../sidebars/hooks/use-indentation"
import { calculateIndicatorPosition } from "../helpers/calculate-indicator-position"

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
      <div
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
    height: "var(--sdn-size-xsmall)",
    width: "var(--sdn-size-xsmall)",
    borderRadius: "9999px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.charcoal[500],
  }

  return (
    <div style={lineStyle}>
      <div
        style={{
          left: "-8px",
          top: "0.5px",
          transform: "translateY(-50%)",
          ...circleStyle,
        }}
      />
    </div>
  )
}
