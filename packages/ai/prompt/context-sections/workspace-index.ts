import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isAuthoredBoard, isComponentBoard } from "@seldon/core/workspace/model/components"

import { matchNodeStrings } from "./node-strings"
import { section } from "./section"

import type { Workspace } from "@seldon/core/workspace/types"

const BOARDS_TITLE = "Component boards in the workspace (board key -> catalog id -> label):"

/**
 * Context section: Workspace boards.
 *
 * Lists every component and authored board so the model can locate one other
 * than the active board. This is reference data for search, not an edit target
 * on its own.
 *
 * When `isolation` is set (Isolation Mode), every board is still listed, but each
 * row is marked as the isolated anchor, an in-scope dependency, or out of scope,
 * so the model sees the boundary without a separate tool. Out-of-scope boards
 * carry a note that editing them is rejected at commit.
 */
export function workspaceBoardsSection(
  workspace: Workspace,
  isolation?: { isolatedBoardKey: string; allowedBoardKeys: Set<string> },
): string[] {
  const marker = (key: string): string => {
    if (!isolation) return ""
    if (key === isolation.isolatedBoardKey) return " [isolated anchor]"
    if (isolation.allowedBoardKeys.has(key)) return " [in scope]"

    return " [out of scope: edits rejected]"
  }

  const rows: string[] = []

  for (const [key, board] of Object.entries(workspace.boards)) {
    if (isComponentBoard(board)) {
      rows.push(`- ${key} -> ${board.catalogId} -> "${board.label}"${marker(key)}`)
    } else if (isAuthoredBoard(board)) {
      // Authored boards have no catalog schema; mark them so the model treats
      // the key as the board and does not look up a catalog id for it.
      rows.push(`- ${key} -> authored -> "${board.label}"${marker(key)}`)
    }
  }

  return section(BOARDS_TITLE, rows)
}

const FIND_LIMIT = 50

/**
 * Context section: Workspace node search.
 *
 * Searches every component and authored board's variant trees for nodes whose
 * label or resolved catalog id contains the query, and reports each match with
 * the board and variant it lives on. The board and variant are what make an
 * off-screen hit actionable, and what the model must name when targeting a node
 * it cannot see.
 */
export function findNodesSection(
  workspace: Workspace,
  query: string,
  allowedBoardKeys?: Set<string>,
): string[] {
  const needle = query.trim().toLowerCase()

  if (needle === "") return []

  const matches: string[] = []

  for (const [key, board] of Object.entries(workspace.boards)) {
    if (!isComponentBoard(board) && !isAuthoredBoard(board)) continue
    // In Isolation Mode, skip boards outside the dependency closure so search
    // never surfaces a node the turn cannot edit.
    if (allowedBoardKeys && !allowedBoardKeys.has(key)) continue
    let variantRootId = ""

    walkBoardTreeRefs(board.variants, (ref, parent) => {
      if (parent === null) variantRootId = ref.id
      const node = workspace.nodes[ref.id]

      if (!node) return
      const catalogId = getNodeCatalogId(node, workspace) ?? ""
      const label = node.label ?? ""
      const byName =
        label.toLowerCase().includes(needle) || catalogId.toLowerCase().includes(needle)
      const snippet = byName ? null : matchNodeStrings(workspace, ref.id, needle)

      if (!byName && snippet === null) return
      const kind = catalogId ? `${node.level} ${catalogId}` : node.level
      const labelText = label ? ` label="${label}"` : ""
      const valueText = snippet ? ` value="${snippet}"` : ""

      matches.push(
        `- ${ref.id} [${kind}]${labelText}${valueText} on board ${key} "${board.label}" variant ${variantRootId}`,
      )
    })
    if (matches.length >= FIND_LIMIT) break
  }

  return section(`Nodes across the workspace matching "${query}":`, matches.slice(0, FIND_LIMIT))
}
