import { isComponentBoard } from "../../../model"
import type { Board } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import {
  formatNodeCatalog,
  parseNodeCatalog,
} from "../../../model/template-ref"
import type { Workspace } from "../../../model/workspace"

/** Dropped catalog id mapped to its replacement id. */
const RENAME_MAP: Record<string, string> = {
  listText: "listItem",
}

/** Rewrites a node's catalog template to the renamed catalog id. */
function migrateNode(node: EntryNode): EntryNode {
  const parsed = parseNodeCatalog(node.template)
  if (!parsed) return node

  const host = RENAME_MAP[parsed.componentId]
  if (!host) return node

  return { ...node, template: formatNodeCatalog(host) }
}

/**
 * v8: renames the `listText` primitive catalog id to `listItem`. It rewrites
 * every `catalog:listText` node template and component board `catalogId` to the
 * new id. Node overrides and child subtrees are unaffected.
 */
export function migrateV8RenameListItem(workspace: Workspace): Workspace {
  const next: Workspace = {
    ...workspace,
    nodes: { ...workspace.nodes },
    boards: { ...workspace.boards },
  }

  for (const [nodeId, node] of Object.entries(next.nodes) as Array<
    [string, EntryNode]
  >) {
    next.nodes[nodeId] = migrateNode(node)
  }

  for (const [boardKey, board] of Object.entries(next.boards) as Array<
    [string, Board]
  >) {
    if (!isComponentBoard(board)) continue

    const host = RENAME_MAP[board.catalogId]
    if (!host) continue

    next.boards[boardKey] = { ...board, catalogId: host }
  }

  return next
}
