import { ComponentId } from "@seldon/core/components/constants"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import {
  contentAction,
  emptyPlan,
  getCatalogId,
  getNodeContent,
  getParentAndIndex,
  insertSiblingAction,
  isInsideDefaultVariant,
  siblingBoardKey,
} from "./helpers"

import type { TextEditPlan } from "./types"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

export function planEnterSplit(
  workspace: Workspace,
  nodeId: string,
  caretOffset: number,
): TextEditPlan {
  const node = workspace.nodes[nodeId]

  if (!node) return emptyPlan(nodeId, caretOffset)
  if (isInsideDefaultVariant(node, workspace)) return emptyPlan(nodeId, caretOffset)

  const catalogId = getCatalogId(node, workspace)

  if (!catalogId) return emptyPlan(nodeId, caretOffset)

  const placement = getParentAndIndex(workspace, nodeId)

  if (!placement) return emptyPlan(nodeId, caretOffset)

  const full = getNodeContent(workspace, nodeId)
  const offset = Math.max(0, Math.min(caretOffset, full.length))
  const before = full.slice(0, offset)
  const after = full.slice(offset)
  const actions: WorkspaceAction[] = []

  if (catalogId === ComponentId.PARAGRAPH) {
    const board = getBoardByNodeId(workspace, nodeId)
    const childIds = board ? getChildrenIds(board, nodeId) : []
    const firstChild = childIds[0]

    if (firstChild) {
      actions.push(contentAction(firstChild, before))
    }

    for (const childId of childIds.slice(1)) {
      actions.push({ type: "remove_instance", payload: { instanceId: childId } })
    }
  } else {
    actions.push(contentAction(nodeId, before))
  }

  const insertIndex = placement.index + 1

  actions.push(
    insertSiblingAction(workspace, siblingBoardKey(catalogId), placement.parentId, insertIndex),
  )

  let next = workspace

  try {
    next = applyActions(workspace, actions)
  } catch {
    return {
      actions,
      nextNodeId: nodeId,
      nextOffset: offset,
    }
  }

  const parentBoard = getBoardByNodeId(next, placement.parentId)
  const siblings = parentBoard ? getChildrenIds(parentBoard, placement.parentId) : []
  const createdId = siblings[insertIndex] ?? null

  if (createdId && after.length > 0) {
    const created = next.nodes[createdId]
    const createdCatalog = created ? getCatalogId(created, next) : null

    if (createdCatalog === ComponentId.PARAGRAPH) {
      const createdBoard = getBoardByNodeId(next, createdId)
      const createdChild = createdBoard ? getChildrenIds(createdBoard, createdId)[0] : null

      if (createdChild) {
        actions.push(contentAction(createdChild, after))
      }
    } else {
      actions.push(contentAction(createdId, after))
    }
  }

  return {
    actions,
    nextNodeId: createdId,
    nextOffset: 0,
  }
}
