import { contentAction, emptyPlan } from "./helpers"

import type { TextEditPlan } from "./types"

export function planContentCommit(nodeId: string, content: string): TextEditPlan {
  if (nodeId.length === 0) return emptyPlan(nodeId, content.length)

  return {
    actions: [contentAction(nodeId, content)],
    nextNodeId: nodeId,
    nextOffset: content.length,
  }
}
