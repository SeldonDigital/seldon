import {
  ExtractPayload,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { handleResetNodeProperty } from "../../core/handlers/handle-reset-node-property"

export function handleAiResetNodeProperty(
  payload: ExtractPayload<"ai_reset_node_property">,
  workspace: Workspace,
): Workspace {
  return handleResetNodeProperty(
    {
      nodeId: payload.nodeId as InstanceId | VariantId,
      propertyKey: payload.propertyKey,
      subpropertyKey: payload.subpropertyKey,
    },
    workspace,
  )
}
