import { emptyPlan } from "./helpers"

import type { TextEditPlan } from "./types"
import type { Workspace } from "@seldon/core/workspace/types"

export function planEnterSplit(
  workspace: Workspace,
  nodeId: string,
  caretOffset: number,
): TextEditPlan {
  const node = workspace.nodes[nodeId]

  if (!node) return emptyPlan(nodeId, caretOffset)

  return {
    actions: [],
    nextNodeId: nodeId,
    nextOffset: caretOffset,
    liveEnter: {
      nodeId,
      caretOffset,
    },
  }
}
