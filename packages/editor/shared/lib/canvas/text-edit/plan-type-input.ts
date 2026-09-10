import { getEffectiveNodeProperties } from "@seldon/core/workspace/compute"
import { contentAndRunsAction, emptyPlan } from "./helpers"
import { applyRunText, runId } from "./runs"

import type { TextEditPlan } from "./types"
import type { Workspace } from "@seldon/core/workspace/types"

/** Commits typed copy on the session primitive. */
export function planTypeInput(workspace: Workspace, nodeId: string, content: string): TextEditPlan {
  const node = workspace.nodes[nodeId]

  if (!node) return emptyPlan(nodeId, content.length)

  return {
    actions: [
      contentAndRunsAction(nodeId, [
        {
          id: runId(nodeId, 0),
          content,
          tag: "span",
          bold: false,
          italic: false,
        },
      ]),
    ],
    nextNodeId: nodeId,
    nextOffset: content.length,
  }
}

/** Commits typed copy on one run of the session primitive. */
export function planTypeRun(
  workspace: Workspace,
  nodeId: string,
  runId: string,
  content: string,
  caretOffset: number,
): TextEditPlan {
  const node = workspace.nodes[nodeId]

  if (!node) return emptyPlan(nodeId, caretOffset)

  const properties = getEffectiveNodeProperties(nodeId, workspace)
  const nextRuns = applyRunText(properties, runId, content)

  return {
    actions: [contentAndRunsAction(nodeId, nextRuns)],
    nextNodeId: nodeId,
    nextOffset: caretOffset,
  }
}
