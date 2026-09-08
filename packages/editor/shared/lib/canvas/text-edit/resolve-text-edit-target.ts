import { ComponentId } from "@seldon/core/components/constants"
import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getCatalogId } from "./helpers"

import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Returns the node that should own a canvas text-edit session for a click
 * target. A Text run inside a Paragraph edits the Paragraph. Other editable
 * nodes edit themselves. Everything else returns null.
 */
export function resolveTextEditTarget(workspace: Workspace, nodeId: string): string | null {
  const node = workspace.nodes[nodeId]

  if (!node) return null

  const catalogId = getCatalogId(node, workspace)

  if (catalogId === ComponentId.TEXT) {
    const parentId = getImmediateParentIdInWorkspace(workspace, nodeId)
    const parent = parentId ? workspace.nodes[parentId] : null

    if (parent && getCatalogId(parent, workspace) === ComponentId.PARAGRAPH) {
      return parentId
    }

    return nodeId
  }

  if (catalogId === ComponentId.LIST_ITEM || catalogId === ComponentId.PARAGRAPH) {
    return nodeId
  }

  return null
}
