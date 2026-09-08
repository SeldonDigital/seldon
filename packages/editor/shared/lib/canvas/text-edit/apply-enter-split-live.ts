import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import {
  canInsertTextSibling,
  contentAndRunsAction,
  getParentAndIndex,
  insertSiblingAction,
  siblingBoardKey,
} from "./helpers"
import { readSessionRuns, splitEditRuns } from "./runs"

import type { TextEditLiveEnter } from "./types"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

export interface AppliedEnterSplit {
  workspace: Workspace
  nextNodeId: string | null
  nextOffset: number
}

function applyOrSame(workspace: Workspace, actions: WorkspaceAction[]): Workspace {
  try {
    return applyActions(workspace, actions)
  } catch {
    return workspace
  }
}

/** Inserts a sibling Text at the caret, or exits when the parent cannot take one. */
export function applyEnterSplitLive(
  workspace: Workspace,
  liveEnter: TextEditLiveEnter,
): AppliedEnterSplit {
  const node = workspace.nodes[liveEnter.nodeId]

  if (!node || !canInsertTextSibling(workspace, liveEnter.nodeId)) {
    return { workspace, nextNodeId: null, nextOffset: liveEnter.caretOffset }
  }

  const placement = getParentAndIndex(workspace, liveEnter.nodeId)

  if (!placement) {
    return { workspace, nextNodeId: null, nextOffset: liveEnter.caretOffset }
  }

  const runs = readSessionRuns(workspace, liveEnter.nodeId)
  const full = runs.map((run) => run.content).join("")
  const offset = Math.max(0, Math.min(liveEnter.caretOffset, full.length))
  const { before, after } = splitEditRuns(runs, offset)
  const beforeIds = childIds(workspace, placement.parentId)
  let next = applyOrSame(workspace, [
    contentAndRunsAction(liveEnter.nodeId, before),
    insertSiblingAction(workspace, siblingBoardKey(), placement.parentId, placement.index + 1),
  ])
  const createdId = firstNewId(beforeIds, childIds(next, placement.parentId))

  if (createdId) {
    next = applyOrSame(next, [contentAndRunsAction(createdId, after)])
  }

  return {
    workspace: next,
    nextNodeId: createdId ?? null,
    nextOffset: 0,
  }
}

function childIds(workspace: Workspace, parentId: string): string[] {
  const board = getBoardByNodeId(workspace, parentId)

  if (!board) return []

  return getChildrenIds(board, parentId)
}

function firstNewId(beforeIds: readonly string[], afterIds: readonly string[]): string | null {
  const known = new Set(beforeIds)

  return afterIds.find((id) => !known.has(id)) ?? null
}
