import { produce } from "immer"
import type { ReferenceMap } from "./get-reference-map"
import type { AgentWireAction } from "./types"

export function isReferenceId(id: string): id is string {
  return id.startsWith("$")
}

/**
 * Swaps `$…` reference placeholders in a wire action payload for resolved node ids.
 */
export function replaceReferenceIdsInWireAction(
  referenceMap: ReferenceMap,
  action: AgentWireAction,
): AgentWireAction {
  return produce(action, (draft) => {
    if (!draft.payload) return

    const target = draft.payload.target
    if (target && typeof target === "object" && "parentId" in target) {
      const parentId = target.parentId
      if (typeof parentId === "string" && isReferenceId(parentId)) {
        const resolved = referenceMap[parentId]
        if (resolved) {
          ;(target as { parentId: string }).parentId = resolved
        }
      }
    }

    const nodeId = draft.payload.nodeId
    if (typeof nodeId === "string" && isReferenceId(nodeId)) {
      const resolved = referenceMap[nodeId]
      if (resolved) {
        draft.payload.nodeId = resolved
      }
    }

    const instanceId = draft.payload.instanceId
    if (typeof instanceId === "string" && isReferenceId(instanceId)) {
      const resolved = referenceMap[instanceId]
      if (resolved) {
        draft.payload.instanceId = resolved
      }
    }

    const variantId = draft.payload.variantId
    if (typeof variantId === "string" && isReferenceId(variantId)) {
      const resolved = referenceMap[variantId]
      if (resolved) {
        draft.payload.variantId = resolved
      }
    }
  })
}
