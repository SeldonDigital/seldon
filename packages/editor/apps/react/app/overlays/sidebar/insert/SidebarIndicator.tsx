import { DropIndicator } from "@app/overlays/primitives"

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
  const position = calculateIndicatorPosition(placement)

  return <DropIndicator color="var(--sdn-swatch-accent)" position={position} dotOffset={0} />
}
