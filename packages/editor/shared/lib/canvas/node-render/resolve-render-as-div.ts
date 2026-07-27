import { ComponentId } from "@seldon/core/components/constants"
import { collectDescendantNodeIds } from "../../workspace/component-tree"
import { findComponentForNode, getNodeCatalogComponentId } from "../../workspace/node-tree"

import type { EntryNode, Workspace } from "@seldon/core/workspace/types"

/**
 * A Button nested inside another Button renders as a div on the canvas to avoid
 * invalid nested interactive markup.
 */
export function resolveRenderAsDiv(
  node: EntryNode,
  workspace: Workspace,
  nodeId: string,
  catalogComponentId: ComponentId | null,
): boolean {
  if (catalogComponentId !== ComponentId.BUTTON) return false
  const board = findComponentForNode(node, workspace)

  if (!board) return false

  return collectDescendantNodeIds(board, nodeId).some((descendantId) => {
    const descendant = workspace.nodes[descendantId]

    if (!descendant) return false

    return getNodeCatalogComponentId(descendant, workspace) === ComponentId.BUTTON
  })
}
