import { EntryNodeId, Workspace } from "../../types"
import { findBoardByTreeNodeId } from "../components/find-board-by-tree-node-id"
import { getBoardVariantRootIds } from "../components/get-board-variant-root-ids"

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
  const board = findBoardByTreeNodeId(workspace, variantId)
  if (!board) return []

  return getBoardVariantRootIds(board).filter((id) => id !== variantId)
}
