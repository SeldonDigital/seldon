import { ComponentId } from "@seldon/core/components/constants"
import { Board } from "@seldon/core/workspace/types"
import { VariantId } from "@seldon/core/workspace/types"
import { getIconSetBoardProperties } from "./get-icon-set-board-properties"

export function createIconSetBoard(defaultVariantId: VariantId): Board {
  return {
    id: ComponentId.ICON_SET,
    component: ComponentId.ICON_SET,
    label: "Icon Sets",
    order: 0,
    theme: "default",
    properties: getIconSetBoardProperties(),
    variants: [defaultVariantId],
  }
}
