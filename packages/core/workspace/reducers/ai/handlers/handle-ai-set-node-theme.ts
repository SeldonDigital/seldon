import {
  ExtractPayload,
  InstanceId,
  VariantId,
  Workspace,
} from "../../../types"
import { handleSetNodeTheme } from "../../core/handlers/handle-set-node-theme"

export function handleAiSetNodeTheme(
  payload: ExtractPayload<"ai_set_node_theme">,
  workspace: Workspace,
): Workspace {
  return handleSetNodeTheme(
    {
      nodeId: payload.nodeId as VariantId | InstanceId,
      theme: payload.theme,
    },
    workspace,
  )
}
