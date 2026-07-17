import type { Board, EntryNodeId, Workspace } from "../../types"
import { getCompositionContainers } from "../general/get-composition-containers"
import { isUserVariant } from "../general/is-user-variant"
import { getBoardByNodeId } from "./get-board-by-node-id"

/**
 * Collects the user-variant root ids on a board that repeat a label already
 * used by an earlier user variant on the same board. The first occurrence of a
 * label is kept; every later occurrence is returned as a duplicate.
 *
 * Duplicate labels are export-unsafe: a user variant exports under a name
 * derived from its label, so two variants that share a label resolve to the
 * same component name and output path.
 */
function collectBoardDuplicateLabelIds(
  board: Board,
  workspace: Workspace,
  into: Set<string>,
): void {
  const firstIdByLabel = new Map<string, string>()
  for (const ref of board.variants) {
    const node = workspace.nodes[ref.id]
    if (!node || !isUserVariant(node)) continue
    if (firstIdByLabel.has(node.label)) {
      into.add(ref.id)
    } else {
      firstIdByLabel.set(node.label, ref.id)
    }
  }
}

/**
 * Returns every user-variant node id whose label duplicates an earlier sibling
 * on the same board, across all composition boards.
 */
export function getDuplicateVariantLabelNodeIds(
  workspace: Workspace,
): Set<string> {
  const duplicates = new Set<string>()
  for (const board of getCompositionContainers(workspace)) {
    collectBoardDuplicateLabelIds(board, workspace, duplicates)
  }
  return duplicates
}

/**
 * Reports whether this user variant repeats a label already used by an earlier
 * user variant on the same board. Scoped to the node's own board, so it stays
 * cheap for per-row rendering.
 */
export function isDuplicateVariantLabel(
  workspace: Workspace,
  nodeId: EntryNodeId,
): boolean {
  const node = workspace.nodes[nodeId]
  if (!node || !isUserVariant(node)) return false

  const board = getBoardByNodeId(workspace, nodeId)
  if (!board) return false

  for (const ref of board.variants) {
    const sibling = workspace.nodes[ref.id]
    if (!sibling || !isUserVariant(sibling)) continue
    if (sibling.label !== node.label) continue
    return ref.id !== nodeId
  }
  return false
}
