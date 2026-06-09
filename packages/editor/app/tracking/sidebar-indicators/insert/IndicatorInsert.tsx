import { Placement } from "@lib/types"
import { COLORS } from "@lib/helpers/colors"
import { FC } from "react"
import { CSSProperties } from "react"
import {
  InsertIndicatorLine,
  Pointer,
} from "@seldon/components/custom-components"
import { useIndentation } from "../../../sidebars/hooks/use-indentation"
import { calculateIndicatorPosition } from "../helpers/calculate-indicator-position"

type IndicatorInsertProps = {
  placement: Placement
}

/**
 * Visual indicator for insert/component tool showing where items will be inserted.
 */
export const IndicatorInsert: FC<IndicatorInsertProps> = ({ placement }) => {
  const indentation = useIndentation()
  // For "inside" placement, use next indentation level (where children would be inserted)
  // For "before" and "after", use current indentation level (same as the node)
  const effectiveIndentation =
    placement === "inside" ? indentation + 1 : indentation
  const position = calculateIndicatorPosition(placement, effectiveIndentation)

  const lineStyle: CSSProperties = {
    position: "absolute",
    zIndex: 20,
    pointerEvents: "none",
    backgroundColor: COLORS.accent[500],
    ...position,
  }

  const circleStyle: CSSProperties = {
    position: "absolute",
    height: "var(--sdn-size-xsmall)",
    width: "var(--sdn-size-xsmall)",
    borderRadius: "9999px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: COLORS.accent[500],
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
