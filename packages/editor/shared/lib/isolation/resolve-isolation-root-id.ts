import { getParentNodeIds } from "../workspace/component-tree"
import { getBoardVariantRootIds } from "../workspace/workspace-accessors"

import type { Board, EntryNodeId } from "@seldon/core/workspace/types"

/**
 * The variant Isolation mode anchors on for a selection, or null when the
 * selection sits outside a variant tree.
 *
 * Isolation freezes one variant, so a selection anywhere inside a variant
 * resolves to the variant above it. The variant root itself resolves to itself.
 *
 * `selectedNodeRootId` is the slash-joined path of the column the node was
 * clicked in, whose first segment is that column's variant root. It answers
 * which copy is meant when a child id renders in more than one variant column.
 * A sidebar selection carries no column, so the board tree is walked upward
 * instead, which lands on whichever column holds the node.
 */
export function resolveIsolationRootId(
  selectedNodeId: EntryNodeId | null,
  selectedNodeRootId: string | null,
  board: Board | null,
): EntryNodeId | null {
  if (!selectedNodeId || !board) return null

  const rootIds = getBoardVariantRootIds(board)

  if (rootIds.includes(selectedNodeId)) return selectedNodeId

  const clickedRootId = selectedNodeRootId?.split("/")[0]

  if (clickedRootId && rootIds.includes(clickedRootId)) return clickedRootId

  const parents = getParentNodeIds(board)
  let current = selectedNodeId
  let parent = parents.get(current)

  while (parent) {
    current = parent
    parent = parents.get(current)
  }

  if (!rootIds.includes(current)) return null

  return current
}
