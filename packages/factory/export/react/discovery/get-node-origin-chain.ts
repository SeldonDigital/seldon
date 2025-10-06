import { Node, Workspace } from "@seldon/core"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"

/**
 * Gets all the original nodes of the given nodes until we reach the default variant
 * @param node - The node to get the lineage of
 * @param workspace - The workspace to get the lineage from
 * @returns The lineage of the node
 */
export const getNodeOriginChain = (node: Node, workspace: Workspace) => {
  let original = node
  const nodes = [node]

  while ("instanceOf" in original) {
    original = workspaceService.getNode(original.instanceOf, workspace)
    nodes.push(original)
  }

  return nodes
}
