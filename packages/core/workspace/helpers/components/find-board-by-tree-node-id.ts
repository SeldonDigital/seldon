import type { Board, EntryNodeId, Workspace } from "../../types"
import { getBoardByNodeId } from "./get-board-by-node-id"

/**
 * Finds the board whose variant tree contains this node id.
 *
 * @deprecated Prefer {@link getBoardByNodeId}; kept for existing import paths.
 */
export function findBoardByTreeNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): Board | null {
  return getBoardByNodeId(workspace, nodeId)
}
