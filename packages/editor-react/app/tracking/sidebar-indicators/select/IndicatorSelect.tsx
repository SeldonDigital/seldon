import { DropIndicator, OutlineBox } from "@app/overlays"
import { COLORS } from "@seldon/editor/lib/helpers/colors"
import { Placement } from "@seldon/editor/lib/types"
import { CSSProperties, FC } from "react"

import { useIndentation } from "../../../sidebars/hooks/use-indentation"
import { calculateIndicatorPosition } from "../helpers/calculate-indicator-position"

type IndicatorSelectProps = {
  placement: Placement
}

const insideOutlineStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 20,
  pointerEvents: "none",
  border: `1px solid ${COLORS.primary[600]}`,
  borderRadius: "4px",
  boxSizing: "border-box",
}

/**
 * Visual indicator for select tool showing where items will be dropped during drag operations.
 */
export const IndicatorSelect: FC<IndicatorSelectProps> = ({ placement }) => {
  const indentation = useIndentation()

  // "inside" nests the dragged object, so outline the whole target row like a
  // selection instead of drawing an edge line.
  if (placement === "inside") {
    return <OutlineBox style={insideOutlineStyle} />
  }

  const position = calculateIndicatorPosition(placement, indentation)

  return <DropIndicator color={COLORS.primary[600]} position={position} />
}
