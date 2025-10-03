import {
  ExtractPayload,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { handleRemoveNode } from "../../core/handlers/handle-remove-node"

export function handleAiRemoveNode(
  payload: ExtractPayload<"ai_remove_node">,
  workspace: Workspace,
): Workspace {
  return handleRemoveNode(
    {
      nodeId: payload.nodeId as InstanceId | VariantId,
    },
    workspace,
  )
}
