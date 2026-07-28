import { DropIndicator } from "@app/overlays/primitives"

import { useIndentation } from "../../../sidebars/hooks/use-indentation"
import { calculateIndicatorPosition } from "../helpers/calculate-indicator-position"

import type { Placement } from "@seldon/editor/lib/types"
import type { FC } from "react"

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
  const effectiveIndentation = placement === "inside" ? indentation + 1 : indentation
  const position = calculateIndicatorPosition(placement, effectiveIndentation)

  return <DropIndicator color="var(--sdn-swatch-accent)" position={position} />
}
