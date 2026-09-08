import { ComponentId } from "@seldon/core/components/constants"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getSelectionTarget } from "../../workspace/selection-dom"
import { TEXT_EDITABLE_IDS, TEXT_EDIT_PARENT_IDS, getCatalogId } from "./helpers"

import type { Workspace } from "@seldon/core/workspace/types"

export interface TextEditStart {
  nodeId: string
  rootId: string | null
}

/** The path prefix that identifies `nodeId` on a slash-joined selection path. */
export function pathToSelectionNode(path: string | null | undefined, nodeId: string): string {
  if (!path) return nodeId

  const segments = path.split("/")
  const index = segments.lastIndexOf(nodeId)

  if (index >= 0) return segments.slice(0, index + 1).join("/")

  return nodeId
}

/** Sidebar selection for an edit session stays on the primitive. */
export function resolveTextEditSelection(
  workspace: Workspace,
  nodeId: string,
  rootId: string | null,
): TextEditStart {
  const targetId = resolveTextEditTarget(workspace, nodeId) ?? nodeId

  return {
    nodeId: targetId,
    rootId: pathToSelectionNode(rootId, targetId),
  }
}

/**
 * Render path for a node created during an edit (a sibling of the session
 * node). Used so the overlay can find the new copy.
 */
export function rootIdForCreatedNode(
  workspace: Workspace,
  current: { nodeId: string; rootId: string | null },
  createdId: string,
): string {
  const known = new Set((current.rootId ?? current.nodeId).split("/"))
  const chain: string[] = []
  let id: string | null = createdId

  while (id) {
    chain.unshift(id)

    if (known.has(id)) {
      const rest = chain.slice(1)

      if (rest.length === 0) return pathToSelectionNode(current.rootId, id)

      return `${pathToSelectionNode(current.rootId, id)}/${rest.join("/")}`
    }

    id = getImmediateParentIdInWorkspace(workspace, id)
  }

  return chain.join("/")
}

/**
 * Returns the content-bearing primitive that owns a canvas text-edit session.
 * A Paragraph or List Item opens its Text child.
 */
export function resolveTextEditTarget(workspace: Workspace, nodeId: string): string | null {
  const node = workspace.nodes[nodeId]

  if (!node) return null

  const catalogId = getCatalogId(node, workspace)

  if (catalogId && TEXT_EDITABLE_IDS.has(catalogId)) return nodeId

  if (catalogId && TEXT_EDIT_PARENT_IDS.has(catalogId)) {
    return firstTextChildId(workspace, nodeId)
  }

  return null
}

/**
 * Resolves a double-click into a text-edit session. Prefers the node under the
 * cursor, then the current selection.
 */
export function resolveTextEditStart(
  workspace: Workspace,
  eventTarget: EventTarget | null,
  selectedNodeId: string | null,
): TextEditStart | null {
  const target = getSelectionTarget(eventTarget)

  if (target?.kind === "node") {
    const nodeId = resolveTextEditTarget(workspace, target.id)

    if (nodeId) {
      return {
        nodeId,
        rootId: pathToOrUnder(target.rootId, target.id, nodeId),
      }
    }
  }

  if (!selectedNodeId) return null

  const nodeId = resolveTextEditTarget(workspace, selectedNodeId)

  if (!nodeId) return null

  const clickedPath = target?.kind === "node" ? target.rootId : null
  const clickedId = target?.kind === "node" ? target.id : selectedNodeId

  return {
    nodeId,
    rootId: pathToOrUnder(clickedPath, clickedId, nodeId),
  }
}

function firstTextChildId(workspace: Workspace, parentId: string): string | null {
  const board = getBoardByNodeId(workspace, parentId)

  if (!board) return null

  for (const childId of getChildrenIds(board, parentId)) {
    const child = workspace.nodes[childId]
    const catalogId = child ? getCatalogId(child, workspace) : null

    if (catalogId === ComponentId.TEXT) return childId
  }

  return null
}

function pathToOrUnder(
  path: string | null | undefined,
  clickedId: string,
  sessionId: string,
): string {
  if (path?.split("/").includes(sessionId)) return pathToSelectionNode(path, sessionId)

  const base = pathToSelectionNode(path, clickedId)

  if (sessionId === clickedId) return base

  return `${base}/${sessionId}`
}
