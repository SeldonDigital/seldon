import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import { applyEnterSplitLive } from "./apply-enter-split-live"
import { applyMarkLive } from "./apply-mark-live"

import type { TextEditPlan } from "./types"
import type { Workspace } from "@seldon/core/workspace/types"

export interface AppliedTextEditPlan {
  workspace: Workspace
  nextNodeId: string | null
  nextOffset: number
}

/** Applies a text-edit plan once. Live enter and marks use ids from the live tree. */
export function applyTextEditPlan(workspace: Workspace, plan: TextEditPlan): AppliedTextEditPlan {
  let next = plan.actions.length === 0 ? workspace : applyActions(workspace, plan.actions)
  let nextNodeId = plan.nextNodeId
  let nextOffset = plan.nextOffset

  if (plan.liveEnter) {
    const split = applyEnterSplitLive(next, plan.liveEnter)

    next = split.workspace
    nextNodeId = split.nextNodeId
    nextOffset = split.nextOffset
  }

  if (plan.liveMark) {
    const marked = applyMarkLive(next, plan.liveMark)

    next = marked.workspace
    nextNodeId = marked.nextNodeId
    nextOffset = marked.nextOffset
  }

  return {
    workspace: next,
    nextNodeId,
    nextOffset,
  }
}
