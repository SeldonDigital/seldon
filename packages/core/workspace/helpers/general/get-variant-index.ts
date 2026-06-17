import { EntryNodeId, Workspace } from "../../types"
import { getBoardByNodeId } from "../components/get-board-by-node-id"
import { getBoardVariantRootIds } from "../components/get-board-variant-root-ids"

/**
 * Gets the index position of a variant within its board's variants array.
 * @param variantId - The ID of the variant node
 * @param workspace - The workspace containing the boards and variants
 * @returns The index of the variant in its board, or -1 if not found
 */
export function getVariantIndex(variantId: EntryNodeId, workspace: Workspace) {
  const board = getBoardByNodeId(workspace, variantId)
  if (!board) return -1
  return getBoardVariantRootIds(board).indexOf(variantId)
}
