import { ComponentId } from "../../../components/constants"
import { invariant } from "../../../index"
import { ErrorMessages } from "../../constants"
import { EntryNode, Workspace } from "../../types"
import { getBoardById } from "../components/get-board-by-id"
import { getVariantById } from "./get-variant-by-id"

/**
 * Retrieves the default variant for a component (the first variant in the board's variants array).
 * For Theme boards, returns the first variant (which is a custom variant, not a default variant).
 * @param componentId - The component ID to get the default variant for
 * @param workspace - The workspace containing the boards and variants
 * @returns The default variant for the component (or first variant for Theme boards)
 * @throws Error if the board or variant is not found
 */
export function getDefaultVariant(
  componentId: ComponentId,
  workspace: Workspace,
): EntryNode & { type: "default" | "variant" } {
  const board = getBoardById(componentId, workspace)
  const defaultVariantId = board.variants[0]?.id
  invariant(defaultVariantId, ErrorMessages.defaultVariantNotFound(componentId))

  return getVariantById(defaultVariantId, workspace)
}
