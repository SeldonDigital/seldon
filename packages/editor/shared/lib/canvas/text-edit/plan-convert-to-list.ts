import { ComponentId } from "@seldon/core/components/constants"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import {
  emptyPlan,
  getCatalogId,
  getNodeContent,
  getParentAndIndex,
  isInsideDefaultVariant,
} from "./helpers"

import type { TextEditPlan } from "./types"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

export function planConvertToList(
  workspace: Workspace,
  nodeId: string,
  ordered: boolean,
): TextEditPlan {
  const node = workspace.nodes[nodeId]

  if (!node) return emptyPlan(nodeId, 0)
  if (isInsideDefaultVariant(node, workspace)) return emptyPlan(nodeId, 0)

  const catalogId = getCatalogId(node, workspace)

  if (!catalogId) return emptyPlan(nodeId, 0)

  if (catalogId === ComponentId.LIST || catalogId === ComponentId.LIST_ITEM) {
    return emptyPlan(nodeId, 0)
  }

  const placement = getParentAndIndex(workspace, nodeId)

  if (!placement) return emptyPlan(nodeId, 0)

  const content = getNodeContent(workspace, nodeId)
  const replace: WorkspaceAction = {
    type: "replace_instance",
    payload: {
      instanceId: nodeId,
      boardKey: ComponentId.LIST,
      variantFallbacks: ordered ? ["ordered"] : undefined,
      content,
    },
  }

  let next = workspace

  try {
    next = applyActions(workspace, [replace])
  } catch {
    return emptyPlan(nodeId, 0)
  }

  const parentBoard = getBoardByNodeId(next, placement.parentId)
  const siblings = parentBoard ? getChildrenIds(parentBoard, placement.parentId) : []
  const createdId = siblings[placement.index] ?? null
  const actions: WorkspaceAction[] = [replace]

  if (createdId) {
    const listBoard = getBoardByNodeId(next, createdId)
    const items = listBoard ? getChildrenIds(listBoard, createdId) : []

    for (const extraId of items.slice(1)) {
      actions.push({ type: "remove_instance", payload: { instanceId: extraId } })
    }
  }

  return {
    actions,
    nextNodeId: createdId,
    nextOffset: content.length,
  }
}
