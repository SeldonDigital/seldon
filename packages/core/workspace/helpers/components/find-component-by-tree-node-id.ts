import type { ComponentEntry, EntryNodeId, Workspace } from "../../types"
import { getComponentByNodeId } from "./get-component-by-node-id"

/**
 * Finds the board whose variant tree contains this node id.
 *
 * @deprecated Prefer {@link getComponentByNodeId}; kept for existing import paths.
 */
export function findComponentByTreeNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): ComponentEntry | null {
  return getComponentByNodeId(workspace, nodeId)
}
