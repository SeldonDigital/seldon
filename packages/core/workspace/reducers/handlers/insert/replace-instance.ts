import { getComponentSchema } from "../../../../components/catalog"
import { isComponentId } from "../../../../components/constants"
import { ValueType } from "../../../../properties"
import { debugGroup, debugGroupEnd, debugLog } from "../../../../utils/debug-logger"
import { componentBoardSchemaVariantNodeId } from "../../../helpers/components/entry-node-ids"
import { getBoardByNodeId } from "../../../helpers/components/get-board-by-node-id"
import { getChildrenIds } from "../../../helpers/components/get-children-ids"
import { getImmediateParentIdInWorkspace } from "../../../helpers/components/get-node-parent-id"
import { getNodeCatalogId } from "../../../helpers/nodes/get-node-catalog-id"
import { getNodeIdAddedByAction } from "../../../helpers/nodes/get-node-id-added-by-action"
import { nodeRetrievalService, typeCheckingService } from "../../../services"
import { addComponent } from "../add/add-component"
import { removeInstance } from "../remove/remove-instance"
import { setNodeProperties } from "../set/set-node-properties"
import { insertVariantInstance } from "./insert-variant-instance"

import type { EntryNodeId, ExtractPayload, Workspace } from "../../../types"

function resolveReplacementVariantId(
  workspace: Workspace,
  boardKey: string,
  variantFallbacks: string[] | undefined,
): string | null {
  if (variantFallbacks) {
    for (const variantId of variantFallbacks) {
      const nodeId = componentBoardSchemaVariantNodeId(boardKey, variantId)

      if (workspace.nodes[nodeId]) return nodeId
    }
  }

  const board = workspace.boards[boardKey]
  const defaultId = board?.variants[0]?.id

  return defaultId ?? null
}

function findFirstContentNodeId(rootId: EntryNodeId, workspace: Workspace): EntryNodeId | null {
  const node = workspace.nodes[rootId]

  if (!node) return null

  const catalogId = getNodeCatalogId(node, workspace)

  if (catalogId && isComponentId(catalogId)) {
    const schema = getComponentSchema(catalogId)

    if ("content" in schema.properties) return rootId
  }

  const board = getBoardByNodeId(workspace, rootId)

  if (!board) return null

  for (const childId of getChildrenIds(board, rootId)) {
    const found = findFirstContentNodeId(childId, workspace)

    if (found) return found
  }

  return null
}

/**
 * Inserts a catalog tree at the same parent and index as `instanceId`, copies
 * optional `content` onto the first descendant that exposes `content`, then
 * removes the original instance.
 */
export function replaceInstance(
  payload: ExtractPayload<"replace_instance">,
  workspace: Workspace,
): Workspace {
  const node = nodeRetrievalService.getNode(payload.instanceId, workspace)

  if (!typeCheckingService.isInstance(node)) {
    return workspace
  }

  const parentId = getImmediateParentIdInWorkspace(workspace, payload.instanceId)

  if (!parentId) {
    return workspace
  }

  const parent = nodeRetrievalService.getNode(parentId, workspace)

  if (typeCheckingService.isVariant(parent) && typeCheckingService.isDefaultVariant(parent)) {
    debugGroup("Workspace", "replaceInstance", "Replace not allowed")
    debugLog("Workspace", "replaceInstance", "Cannot replace inside a default variant", {
      instanceId: payload.instanceId,
    })
    debugGroupEnd("Workspace", "replaceInstance", "Replace not allowed")

    return workspace
  }

  const sourceBoard = getBoardByNodeId(workspace, payload.instanceId)

  if (!sourceBoard) {
    return workspace
  }

  const siblings = getChildrenIds(sourceBoard, parentId)
  const index = siblings.indexOf(payload.instanceId)

  if (index < 0) {
    return workspace
  }

  debugGroup("Workspace", "replaceInstance", "Replacing instance")
  debugLog("Workspace", "replaceInstance", "Replacement target", {
    instanceId: payload.instanceId,
    boardKey: payload.boardKey,
    parentId,
    index,
  })

  let next = workspace

  if (!next.boards[payload.boardKey]) {
    next = addComponent(
      {
        boardKey: payload.boardKey,
        variantFallbacks: payload.variantFallbacks,
      },
      next,
    )
  }

  const variantId = resolveReplacementVariantId(next, payload.boardKey, payload.variantFallbacks)

  if (!variantId) {
    debugLog("Workspace", "replaceInstance", "Replacement board has no variant to instantiate")
    debugGroupEnd("Workspace", "replaceInstance", "Replacing instance")

    return workspace
  }

  const insertPayload = {
    variantId: variantId as ExtractPayload<"insert_variant_instance">["variantId"],
    target: {
      parentId,
      index,
    },
  }

  next = insertVariantInstance(insertPayload, next)

  const createdId = getNodeIdAddedByAction(
    {
      type: "insert_variant_instance",
      payload: insertPayload,
    },
    next,
  )

  if (payload.content != null && createdId) {
    const contentId = findFirstContentNodeId(createdId, next)

    if (contentId) {
      next = setNodeProperties(
        {
          nodeId: contentId,
          properties: {
            content: {
              type: ValueType.EXACT,
              value: payload.content,
            },
          },
        },
        next,
      )
    }
  }

  next = removeInstance({ instanceId: payload.instanceId }, next)

  debugLog("Workspace", "replaceInstance", "Instance replaced", {
    createdId,
  })
  debugGroupEnd("Workspace", "replaceInstance", "Replacing instance")

  return next
}
