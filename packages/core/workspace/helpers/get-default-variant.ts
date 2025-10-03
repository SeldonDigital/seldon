import { ComponentId } from "../../components/constants"
import { invariant } from "../../index"
import { ErrorMessages } from "../constants"
import { Variant, Workspace } from "../types"
import { getBoardById } from "./get-board-by-id"
import { getVariantById } from "./get-variant-by-id"

/**
 * Retrieves the default variant for a component (the first variant in the board's variants array).
 * @param componentId - The component ID to get the default variant for
 * @param workspace - The workspace containing the boards and variants
 * @returns The default variant for the component
 * @throws Error if the board or default variant is not found
 */
export function getDefaultVariant(
  componentId: ComponentId,
  workspace: Workspace,
): Variant {
  const board = getBoardById(componentId, workspace)
  const defaultVariantId = board.variants[0]
  invariant(defaultVariantId, ErrorMessages.defaultVariantNotFound(componentId))

  return getVariantById(defaultVariantId, workspace)
}
