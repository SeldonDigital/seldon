import {
  ExtractPayload,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { handleReorderNode } from "../../core/handlers/handle-reorder-node"

export function handleAiReorderNode(
  payload: ExtractPayload<"ai_reorder_node">,
  workspace: Workspace,
): Workspace {
  return handleReorderNode(
    {
      nodeId: payload.nodeId as InstanceId | VariantId,
      newIndex: payload.newIndex,
    },
    workspace,
  )
}
