import { ComponentId } from "@seldon/core/components/constants"
import { HtmlElement, ValueType } from "@seldon/core/properties"
import { getEffectiveNodeProperties } from "@seldon/core/workspace/compute"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { nodeRelationshipService, typeCheckingService } from "@seldon/core/workspace/services"
import { getNodeCatalogComponentId } from "../../workspace/node-tree"

import type { TextEditPlan } from "./types"
import type {
  EntryNode,
  EntryNodeId,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

export const TEXT_EDITABLE_IDS = new Set<ComponentId>([
  ComponentId.TEXT,
  ComponentId.LIST_ITEM,
  ComponentId.PARAGRAPH,
])

export function emptyPlan(nodeId: string, offset: number): TextEditPlan {
  return {
    actions: [],
    nextNodeId: nodeId,
    nextOffset: offset,
  }
}

export function getCatalogId(node: EntryNode, workspace: Workspace): ComponentId | null {
  return getNodeCatalogComponentId(node, workspace)
}

export function isInsideDefaultVariant(node: EntryNode, workspace: Workspace): boolean {
  if (!typeCheckingService.isVariant(node) && !typeCheckingService.isInstance(node)) {
    return false
  }

  const root = nodeRelationshipService.getRootVariant(node, workspace)

  return typeCheckingService.isDefaultVariant(root)
}

export function getNodeContent(workspace: Workspace, nodeId: string): string {
  const node = workspace.nodes[nodeId]

  if (!node) return ""

  const catalogId = getCatalogId(node, workspace)

  if (catalogId === ComponentId.PARAGRAPH) {
    const board = getBoardByNodeId(workspace, nodeId)

    if (!board) return ""

    return getChildrenIds(board, nodeId)
      .map((childId) => getNodeContent(workspace, childId))
      .join("")
  }

  const properties = getEffectiveNodeProperties(nodeId, workspace)
  const value = properties.content?.value

  return typeof value === "string" ? value : ""
}

export function getParentAndIndex(
  workspace: Workspace,
  nodeId: string,
): { parentId: EntryNodeId; index: number } | null {
  const parentId = getImmediateParentIdInWorkspace(workspace, nodeId)

  if (!parentId) return null

  const board = getBoardByNodeId(workspace, nodeId)

  if (!board) return null

  const index = getChildrenIds(board, parentId).indexOf(nodeId)

  if (index < 0) return null

  return { parentId, index }
}

export function contentAction(nodeId: string, content: string): WorkspaceAction {
  return {
    type: "set_node_properties",
    payload: {
      nodeId,
      properties: {
        content: {
          type: ValueType.EXACT,
          value: content,
        },
      },
    },
  }
}

export function insertSiblingAction(
  workspace: Workspace,
  boardKey: string,
  parentId: string,
  index: number,
): WorkspaceAction {
  if (workspace.boards[boardKey]) {
    return {
      type: "insert_default_instance",
      payload: {
        parentId,
        boardKey,
        index,
      },
    }
  }

  return {
    type: "add_component_and_insert_default_instance",
    payload: {
      boardKey,
      target: {
        parentId,
        index,
      },
    },
  }
}

export function siblingBoardKey(catalogId: ComponentId): string {
  if (catalogId === ComponentId.LIST_ITEM) return ComponentId.LIST_ITEM
  if (catalogId === ComponentId.PARAGRAPH) return ComponentId.PARAGRAPH

  return ComponentId.TEXT
}

export function isBoldElement(value: unknown): boolean {
  return value === HtmlElement.B
}

export function isItalicElement(value: unknown): boolean {
  return value === HtmlElement.EM
}

/** Returns ordered when the line starts with a numbered prefix, otherwise unordered. */
export function matchListPrefix(content: string): { ordered: boolean; rest: string } | null {
  const unordered = content.match(/^[-*]\s+([\s\S]*)$/)

  if (unordered) {
    return { ordered: false, rest: unordered[1] ?? "" }
  }

  const ordered = content.match(/^\d+[.)]\s+([\s\S]*)$/)

  if (ordered) {
    return { ordered: true, rest: ordered[1] ?? "" }
  }

  return null
}

export function getHtmlElementValue(workspace: Workspace, nodeId: string): unknown {
  return getEffectiveNodeProperties(nodeId, workspace).htmlElement?.value
}
