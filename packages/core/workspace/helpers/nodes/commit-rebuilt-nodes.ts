import type { EntryNode, Workspace } from "../../types"

/**
 * Writes rebuilt nodes into the workspace. A rebuild mints a fresh entry for
 * every node it produces, so a node that reuses an existing id takes the ref
 * already on that id: a ref names a node for generated code and app logic, and
 * a reset changes the node's template state, not which node it is.
 */
export function commitRebuiltNodes(
  workspace: Workspace,
  newNodes: Record<string, EntryNode>,
): void {
  for (const [id, node] of Object.entries(newNodes)) {
    const ref = workspace.nodes[id]?.ref

    workspace.nodes[id] = ref ? { ...node, ref } : node
  }
}
