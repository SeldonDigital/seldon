import { emptyPlan } from "./helpers"

import type { TextEditPlan, TextEditRange, TextMark } from "./types"
import type { Workspace } from "@seldon/core/workspace/types"

export function planApplyMark(
  workspace: Workspace,
  nodeId: string,
  range: TextEditRange,
  mark: TextMark,
): TextEditPlan {
  const node = workspace.nodes[nodeId]

  if (!node) return emptyPlan(nodeId, range.end)

  return {
    actions: [],
    nextNodeId: nodeId,
    nextOffset: range.end,
    liveMark: {
      nodeId,
      range,
      mark,
    },
  }
}
