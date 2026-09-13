import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { resolveComponentKey } from "../../workspace/workspace-accessors"

import type { BoardKey, EntryNodeId, Workspace } from "@seldon/core/workspace/types"

/** The target a capture names, which is a node id, a board key, or neither. */
export interface CaptureTarget {
  nodeId?: string
  boardKey?: string
}

/**
 * The board a capture has to render to reach its target. A node resolves to the
 * board whose variant tree lists it, so an agent can name a variant without
 * knowing which board holds it. Returns undefined when the request names no
 * target, or names one this workspace does not have, and the capture then reads
 * whatever the canvas is already showing.
 */
export function resolveCaptureBoardKey(
  workspace: Workspace,
  target: CaptureTarget,
): BoardKey | undefined {
  if (target.nodeId) {
    const board = getBoardByNodeId(workspace, target.nodeId as EntryNodeId)

    return board ? resolveComponentKey(board, workspace) : undefined
  }

  if (target.boardKey) {
    const board = workspace.boards[target.boardKey] ?? workspace.playgrounds?.[target.boardKey]

    return board ? target.boardKey : undefined
  }

  return undefined
}
