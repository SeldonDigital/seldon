import { getImmediateParentIdInWorkspace } from "@seldon/core/workspace/helpers/components/get-node-parent-id"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Workspace } from "@seldon/core/workspace/types"

/** Uppercases the first letter, used to title an unlabeled node's component id. */
function capitalize(text: string): string {
  return text.length > 0 ? text[0]!.toUpperCase() + text.slice(1) : text
}

/** Display label for one path segment: node label, else component id, else id. */
function segmentLabel(workspace: Workspace, id: string): string {
  const node = workspace.nodes?.[id]
  if (node?.label) return node.label
  const board = workspace.boards?.[id]
  if (board?.label) return board.label
  const catalogId = node ? getNodeCatalogId(node, workspace) : undefined
  return catalogId ? capitalize(catalogId) : id
}

/**
 * The ancestry path to a target as `label/label/label`, root first. A board key
 * resolves to its label, and an unknown id passes through, so every target still
 * reads as one line even when it is not a node.
 */
export function targetPath(
  workspace: Workspace,
  id: string | undefined,
): string {
  if (!id) return "workspace"
  if (workspace.boards?.[id]) return workspace.boards[id]!.label ?? id
  if (!workspace.nodes?.[id]) return id

  const segments: string[] = []
  const seen = new Set<string>()
  let currentId: string | undefined = id
  while (currentId && !seen.has(currentId)) {
    seen.add(currentId)
    segments.unshift(segmentLabel(workspace, currentId))
    currentId =
      getImmediateParentIdInWorkspace(workspace, currentId) ?? undefined
  }
  return segments.join("/")
}
