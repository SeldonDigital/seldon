import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
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

/** Label of the board whose variant list references the entry id, if any. */
function entryBoardLabel(workspace: Workspace, id: string): string | undefined {
  for (const board of Object.values(workspace.boards)) {
    const variants = board.variants as ReadonlyArray<{ id: string }>
    if (variants.some((ref) => ref.id === id)) return board.label
  }
  return undefined
}

/**
 * The composition ancestry for an instance, root first, as
 * `Variant/.../.../Instance`. Climbs the composition parents until the variant
 * root, which has no parent, so the path always starts at the owning variant.
 */
function instancePath(workspace: Workspace, id: string): string {
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

/**
 * The outcome path to a change target, root first, chosen by what the target is:
 *
 * - Board add or remove: `Workspace/Board`.
 * - Default or user variant: `Board/Variant`.
 * - Instance: `Variant/.../.../Instance`.
 * - Theme, font collection, icon set, or media entry: `Board/Variant`.
 *
 * An unknown id passes through, so every target still reads as one line.
 */
export function targetPath(
  workspace: Workspace,
  id: string | undefined,
): string {
  const workspaceLabel = workspace.metadata?.label || "Untitled"
  if (!id) return workspaceLabel

  const board = workspace.boards?.[id]
  if (board) return `${workspaceLabel}/${board.label ?? id}`

  const node = workspace.nodes?.[id]
  if (node) {
    if (node.type === "instance") return instancePath(workspace, id)
    const ownerLabel = getBoardByNodeId(workspace, id)?.label
    return ownerLabel ? `${ownerLabel}/${node.label}` : node.label
  }

  const entry =
    workspace.themes?.[id] ??
    workspace["font-collections"]?.[id] ??
    workspace["icon-sets"]?.[id] ??
    workspace.media?.[id]
  if (entry) {
    const entryLabel = typeof entry.label === "string" ? entry.label : id
    const ownerLabel = entryBoardLabel(workspace, id)
    return ownerLabel ? `${ownerLabel}/${entryLabel}` : entryLabel
  }

  return id
}
