import { ExtractPayload, VariantId, Workspace } from "../../../types"
import { handleSetNodeLabel } from "../../core/handlers/handle-set-node-label"

export function handleAiSetNodeLabel(
  payload: ExtractPayload<"ai_set_node_label">,
  workspace: Workspace,
): Workspace {
  return handleSetNodeLabel(
    {
      nodeId: payload.nodeId as VariantId,
      label: payload.label,
    },
    workspace,
  )
}
