import { ComponentId } from "@seldon/core/components/constants"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { contentAction, emptyPlan, getCatalogId } from "./helpers"

import type { TextEditPlan } from "./types"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

/** Commits typed copy. A Paragraph flattens to its first run so marks drop on type. */
export function planTypeInput(workspace: Workspace, nodeId: string, content: string): TextEditPlan {
  const node = workspace.nodes[nodeId]

  if (!node) return emptyPlan(nodeId, content.length)

  const catalogId = getCatalogId(node, workspace)

  if (catalogId === ComponentId.PARAGRAPH) {
    const board = getBoardByNodeId(workspace, nodeId)
    const childIds = board ? getChildrenIds(board, nodeId) : []
    const firstChild = childIds[0]

    if (!firstChild) return emptyPlan(nodeId, content.length)

    const actions: WorkspaceAction[] = [contentAction(firstChild, content)]

    for (const extraId of childIds.slice(1)) {
      actions.push({ type: "remove_instance", payload: { instanceId: extraId } })
    }

    return {
      actions,
      nextNodeId: nodeId,
      nextOffset: content.length,
    }
  }

  return {
    actions: [contentAction(nodeId, content)],
    nextNodeId: nodeId,
    nextOffset: content.length,
  }
}
