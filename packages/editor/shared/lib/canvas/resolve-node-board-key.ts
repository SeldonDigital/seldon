import { createBoardRefResolver } from "@seldon/core/workspace/helpers/components/board-ref-resolver"

import type { Board, Workspace } from "@seldon/core"

/**
 * Builds a lookup from a rendered node id to the board that node instances.
 *
 * Canvas nodes carry their node id in `data-canvas-node-id`, so this maps an
 * element on the canvas back to the board row it came from. The isolation canvas
 * uses it to size each board from the node it holds.
 */
export function createNodeBoardKeyResolver(
  workspace: Workspace,
  boards: Board[],
): (nodeId: string) => string | null {
  const { resolveRef } = createBoardRefResolver(workspace, boards)

  return (nodeId) => {
    const node = workspace.nodes[nodeId]

    if (!node) return null

    return resolveRef(node)?.key ?? null
  }
}
