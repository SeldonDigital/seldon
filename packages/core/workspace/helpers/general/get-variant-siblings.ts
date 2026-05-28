import { EntryNodeId, Workspace } from "../../types"
import { findComponentByTreeNodeId } from "../components/find-component-by-tree-node-id"
import { getComponentVariantRootIds } from "../components/get-component-variant-root-ids"

/**
 * Get the siblings of a variant
 *
 * @param variantId - The variant to get siblings for
 * @param workspace - The workspace
 */
export function getVariantSiblingIds(
  variantId: EntryNodeId,
  workspace: Workspace,
): EntryNodeId[] {
  const board = findComponentByTreeNodeId(workspace, variantId)
  if (!board) return []

  return getComponentVariantRootIds(board).filter((id) => id !== variantId)
}
