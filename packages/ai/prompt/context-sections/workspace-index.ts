import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import type { Workspace } from "@seldon/core/workspace/types"

import { section } from "./section"

const BOARDS_TITLE =
  "Component boards in the workspace (tier 3, board key -> catalog id -> label):"

/**
 * Context section: Workspace boards (tier 3).
 *
 * The widest scope. Lists every component board so the model can locate one
 * other than the active board. This is reference data, not an edit target: a
 * node reached only through this tier needs the user's permission before an edit.
 */
export function workspaceBoardsSection(workspace: Workspace): string[] {
  const rows: string[] = []
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (board.type !== "component") continue
    rows.push(`- ${key} -> ${board.catalogId} -> "${board.label}"`)
  }
  return section(BOARDS_TITLE, rows)
}

const FIND_LIMIT = 50

/**
 * Context section: Workspace node search (tier 3).
 *
 * Searches every component board's variant trees for nodes whose label or
 * resolved catalog id contains the query, and reports each match with the board
 * and variant it lives on. The board and variant are what make an off-screen hit
 * actionable, and what the model must name when asking to edit a tier-3 node.
 */
export function findNodesSection(
  workspace: Workspace,
  query: string,
): string[] {
  const needle = query.trim().toLowerCase()
  if (needle === "") return []

  const matches: string[] = []
  for (const [key, board] of Object.entries(workspace.boards)) {
    if (board.type !== "component") continue
    let variantRootId = ""
    walkBoardTreeRefs(board.variants, (ref, parent) => {
      if (parent === null) variantRootId = ref.id
      const node = workspace.nodes[ref.id]
      if (!node) return
      const catalogId = getNodeCatalogId(node, workspace) ?? ""
      const label = node.label ?? ""
      const hit =
        label.toLowerCase().includes(needle) ||
        catalogId.toLowerCase().includes(needle)
      if (!hit) return
      const kind = catalogId ? `${node.level} ${catalogId}` : node.level
      const labelText = label ? ` label="${label}"` : ""
      matches.push(
        `- ${ref.id} [${kind}]${labelText} on board ${key} "${board.label}" variant ${variantRootId}`,
      )
    })
    if (matches.length >= FIND_LIMIT) break
  }

  return section(
    `Nodes across the workspace matching "${query}" (tier 3):`,
    matches.slice(0, FIND_LIMIT),
  )
}
