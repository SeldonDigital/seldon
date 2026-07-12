import {
  type EntryNodeId,
  type Workspace,
  parseNodeTemplate,
} from "../../types"

/**
 * Walks a node's template chain to the workspace node that sits directly on a
 * catalog schema, the source every instance in that chain resolves from.
 *
 * Instances template through `node:{sourceId}` links; a default (and any
 * catalog-rooted variant) templates `catalog:{componentId}`. Following the
 * `node:` links to that catalog-rooted terminal yields the node to edit when a
 * change should drive every instance, rather than the catalog schema itself.
 *
 * Returns the input id unchanged when the node is missing, its template is
 * unparseable, or a link dangles, so callers can treat the result as a safe
 * write target. A visited set guards against a cyclic chain.
 */
export function getSourceNodeId(
  workspace: Workspace,
  nodeId: EntryNodeId,
): EntryNodeId {
  const nodes = workspace.nodes
  const visited = new Set<EntryNodeId>()
  let current = nodeId

  while (!visited.has(current)) {
    visited.add(current)
    const node = nodes?.[current]
    if (!node) return current

    const parsed = parseNodeTemplate(node.template)
    if (!parsed) return current
    if (parsed.kind === "catalog") return current

    if (!nodes[parsed.nodeId]) return current
    current = parsed.nodeId
  }

  return current
}
