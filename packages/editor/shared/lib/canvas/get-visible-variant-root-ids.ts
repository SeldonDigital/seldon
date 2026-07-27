import { getBoardVariantRootIds } from "../workspace/workspace-accessors"

import type { Board } from "@seldon/core/workspace/types"

interface VisibleVariantOptions {
  isolatedView: boolean
  selectedNodeRootId: string | null
}

/**
 * Variant root ids the canvas should render for a board. In isolated view, when
 * the selection resolves to one of this board's variant roots, only that variant
 * renders. Otherwise every variant root renders. Shared by both editors.
 */
export function getVisibleVariantRootIds(
  board: Board,
  { isolatedView, selectedNodeRootId }: VisibleVariantOptions,
): string[] {
  const rootIds = getBoardVariantRootIds(board)

  if (isolatedView && selectedNodeRootId && rootIds.includes(selectedNodeRootId)) {
    return [selectedNodeRootId]
  }

  return rootIds
}
