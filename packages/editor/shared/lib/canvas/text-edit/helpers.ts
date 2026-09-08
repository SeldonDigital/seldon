import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { HtmlElement, ValueType } from "@seldon/core/properties"
import { getEffectiveNodeProperties } from "@seldon/core/workspace/compute"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getEffectiveNodeLevel } from "@seldon/core/workspace/helpers/nodes/get-effective-node-level"
import { nodeRelationshipService, typeCheckingService } from "@seldon/core/workspace/services"
import { getNodeCatalogComponentId } from "../../workspace/node-tree"
import { contentFromEditRuns, readSessionRuns, runsProperty, toContentRuns } from "./runs"

import type { TextEditPlan, TextEditRun } from "./types"
import type {
  EntryNode,
  EntryNodeId,
  Workspace,
  WorkspaceAction,
} from "@seldon/core/workspace/types"

export const TEXT_EDITABLE_IDS = new Set<ComponentId>([
  ComponentId.TEXT,
  ComponentId.LINK,
  ComponentId.CITE,
  ComponentId.BLOCKQUOTE,
  ComponentId.LEGEND,
])

export const TEXT_EDIT_PARENT_IDS = new Set<ComponentId>([
  ComponentId.PARAGRAPH,
  ComponentId.LIST_ITEM,
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
  const properties = getEffectiveNodeProperties(nodeId, workspace)
  const value = properties.content?.value

  if (typeof value === "string") return value

  return contentFromEditRuns(readSessionRuns(workspace, nodeId))
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

export function contentAndRunsAction(nodeId: string, runs: TextEditRun[]): WorkspaceAction {
  return {
    type: "set_node_properties",
    payload: {
      nodeId,
      properties: {
        content: {
          type: ValueType.EXACT,
          value: contentFromEditRuns(runs),
        },
        runs: runsProperty(toContentRuns(runs)),
      },
    },
  }
}

export function canInsertTextSibling(workspace: Workspace, nodeId: string): boolean {
  const node = workspace.nodes[nodeId]
  const placement = getParentAndIndex(workspace, nodeId)
  const parent = placement ? workspace.nodes[placement.parentId] : null

  if (!node || !placement || !parent) return false
  if (!typeCheckingService.isInstance(node)) return false
  if (isInsideDefaultVariant(node, workspace)) return false

  const parentLevel = getEffectiveNodeLevel(parent, workspace)

  return typeCheckingService.canLevelContainLevel(parentLevel, ComponentLevel.PRIMITIVE)
}

export function isBoldElement(value: unknown): boolean {
  return value === HtmlElement.B || value === HtmlElement.STRONG
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

export function overlayHtmlElement(workspace: Workspace, nodeId: string): string {
  const value = getHtmlElementValue(workspace, nodeId)

  return typeof value === "string" && value.length > 0 ? value : "div"
}

/** Changes when a primitive's run paint changes, so the overlay recopies type. */
export function textEditPaintKey(workspace: Workspace, nodeId: string): string {
  return readSessionRuns(workspace, nodeId)
    .map((run) => `${run.id}:${run.tag}:${run.bold ? "b" : ""}:${run.italic ? "i" : ""}`)
    .join("|")
}
