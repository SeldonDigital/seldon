import {
  ExtractPayload,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { handleSetNodeProperties } from "../../core/handlers/handle-set-node-properties"

export function handleAiSetNodeProperties(
  payload: ExtractPayload<"ai_set_node_properties">,
  workspace: Workspace,
): Workspace {
  return handleSetNodeProperties(
    {
      nodeId: payload.nodeId as InstanceId | VariantId,
      properties: payload.properties,
    },
    workspace,
  )
}
