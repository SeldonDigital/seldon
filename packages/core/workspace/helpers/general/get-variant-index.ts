import { EntryNodeId, Workspace } from "../../types"
import { findComponentByTreeNodeId } from "../components/find-component-by-tree-node-id"
import { getComponentVariantRootIds } from "../components/get-component-variant-root-ids"

/**
 * Gets the index position of a variant within its board's variants array.
 * @param variantId - The ID of the variant node
 * @param workspace - The workspace containing the boards and variants
 * @returns The index of the variant in its board, or -1 if not found
 */
export function getVariantIndex(variantId: EntryNodeId, workspace: Workspace) {
  const board = findComponentByTreeNodeId(workspace, variantId)
  if (!board) return -1
  return getComponentVariantRootIds(board).indexOf(variantId)
}
