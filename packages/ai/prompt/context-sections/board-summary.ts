import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import {
  isAuthoredBoard,
  isComponentBoard,
} from "@seldon/core/workspace/model/components"
import type { Board, BoardKey, Workspace } from "@seldon/core/workspace/types"

/**
 * Context section: Board summary.
 *
 * The cheapest view of the active board: each variant's name and node count plus
 * the distinct catalog ids present, with no ids or property detail. It lets the
 * model confirm which variant holds a target before it pulls the full tree with
 * get_active_board or expands a branch with describe_node. Returns nothing for a
 * board that owns no variant tree, so the caller can report a clean miss.
 */
export function boardSummarySection(
  workspace: Workspace,
  resolvedKey: BoardKey,
  activeBoard: Board,
): string[] {
  if (!isComponentBoard(activeBoard) && !isAuthoredBoard(activeBoard)) return []

  const catalogLabel =
    "catalogId" in activeBoard ? activeBoard.catalogId : "authored"
  const lines: string[] = [
    `Board summary: ${resolvedKey} -> ${catalogLabel} -> "${activeBoard.label}"`,
  ]

  const boardCatalogIds = new Set<string>()
  activeBoard.variants.forEach((variantRef, index) => {
    const variantNode = workspace.nodes[variantRef.id]
    const variantLabel = variantNode?.label ? ` "${variantNode.label}"` : ""
    const defaultTag = index === 0 ? " (default)" : ""
    let count = 0
    const catalogIds = new Set<string>()
    walkBoardTreeRefs([variantRef], (ref) => {
      count += 1
      const node = workspace.nodes[ref.id]
      if (!node) return
      const catalogId = getNodeCatalogId(node, workspace)
      if (catalogId) {
        catalogIds.add(catalogId)
        boardCatalogIds.add(catalogId)
      }
    })
    const catalogText =
      catalogIds.size > 0 ? [...catalogIds].sort().join(", ") : "(none)"
    lines.push(
      `- variant ${variantRef.id}${variantLabel}${defaultTag}: ${count} nodes; components: ${catalogText}`,
    )
  })

  return lines
}
