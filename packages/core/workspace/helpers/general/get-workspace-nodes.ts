import type { EntryNode, EntryNodeId, Workspace } from "../../types"

/** Returns the workspace node map (`workspace.nodes`). */
export function getWorkspaceNodes(
  workspace: Workspace,
): Record<EntryNodeId, EntryNode> {
  return workspace.nodes
}
