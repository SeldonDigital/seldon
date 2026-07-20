import { DropIndicator } from "@app/overlays"
import { COLORS } from "@seldon/editor/lib/helpers/colors"
import { Placement } from "@seldon/editor/lib/types"
import { FC } from "react"

import { useIndentation } from "../../../sidebars/hooks/use-indentation"
import { calculateIndicatorPosition } from "../helpers/calculate-indicator-position"

type SidebarIndicatorProps = {
  placement: Placement
}

/**
 * Visual indicator for insert/component tool showing where items will be inserted.
 */
export const SidebarIndicator: FC<SidebarIndicatorProps> = ({ placement }) => {
  const indentation = useIndentation()
  // For "inside" placement, use next indentation level (where children would be inserted)
  // For "before" and "after", use current indentation level (same as the node)
  const effectiveIndentation =
    placement === "inside" ? indentation + 1 : indentation
  const position = calculateIndicatorPosition(placement, effectiveIndentation)

  return <DropIndicator color={COLORS.accent[500]} position={position} />
}
