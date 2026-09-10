import { applyTextEditPlan } from "./apply-text-edit-plan"
import { rootIdForCreatedNode } from "./resolve-text-edit-target"

import type { TextEditSession } from "./session-store"
import type { TextEditPlan } from "./types"
import type { Workspace } from "@seldon/core/workspace/types"

export type TextEditCommit =
  | { kind: "noop" }
  | { kind: "fail" }
  | { kind: "move"; workspace: Workspace; session: TextEditSession }
  | { kind: "apply"; workspace: Workspace; session: TextEditSession | null }

/** Resolves the next workspace and session after a text-edit plan. */
export function resolveTextEditCommit(
  workspace: Workspace,
  current: TextEditSession | null,
  plan: TextEditPlan,
): TextEditCommit {
  if (plan.actions.length === 0 && !plan.liveEnter && !plan.liveMark) {
    if (!plan.nextNodeId) return { kind: "noop" }

    const rootId = current
      ? rootIdForCreatedNode(workspace, current, plan.nextNodeId)
      : plan.nextNodeId

    return {
      kind: "move",
      workspace,
      session: {
        nodeId: plan.nextNodeId,
        rootId,
        caretOffset: plan.nextOffset,
      },
    }
  }

  let applied

  try {
    applied = applyTextEditPlan(workspace, plan)
  } catch {
    return { kind: "fail" }
  }

  if (!applied.nextNodeId) {
    return { kind: "apply", workspace: applied.workspace, session: null }
  }

  const rootId = current
    ? rootIdForCreatedNode(applied.workspace, current, applied.nextNodeId)
    : applied.nextNodeId

  return {
    kind: "apply",
    workspace: applied.workspace,
    session: {
      nodeId: applied.nextNodeId,
      rootId,
      caretOffset: applied.nextOffset,
    },
  }
}
