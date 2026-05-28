import { Placement } from "@lib/types"
import { COLORS } from "@lib/utils/colors"
import { FC } from "react"
import { CSSProperties } from "react"
import { useIndentation } from "../../../sidebars/helpers/use-indentation"
import { calculateIndicatorPosition } from "../utils/calculate-indicator-position"

type IndicatorSelectProps = {
  placement: Placement
}

/**
 * Visual indicator for select tool showing where items will be dropped during drag operations.
 */
export const IndicatorSelect: FC<IndicatorSelectProps> = ({ placement }) => {
  const indentation = useIndentation()
  // For "inside" placement, use next indentation level (where children would be inserted)
  // For "before" and "after", use current indentation level (same as the node)
  const effectiveIndentation =
    placement === "inside" ? indentation + 1 : indentation
  const position = calculateIndicatorPosition(placement, effectiveIndentation)

  const lineStyle: CSSProperties = {
    backgroundColor: COLORS.primary[600],
    ...position,
  }

  const circleStyle: CSSProperties = {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.charcoal[500],
  }

  return (
    <div className="pointer-events-none absolute z-20" style={lineStyle}>
      <div
        className="absolute h-2 w-2 rounded-full border"
        style={{
          ...(placement === "inside"
            ? { left: "-8px", top: "0.5px", transform: "translateY(-50%)" }
            : { left: "-8px", top: "0.5px", transform: "translateY(-50%)" }),
          ...circleStyle,
        }}
      />
    </div>
  )
}
