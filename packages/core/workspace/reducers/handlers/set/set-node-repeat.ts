import type { ExtractPayload, Workspace } from "../../../../index"
import { workspaceMutationService } from "../../../services"

/** Sets or clears the editor-only repeat preview state on a node. */
export function setNodeRepeat(
  payload: ExtractPayload<"set_node_repeat">,
  workspace: Workspace,
): Workspace {
  return workspaceMutationService.setNodeRepeat(
    payload.nodeId,
    payload.repeat,
    workspace,
  )
}
