import type { ExtractPayload, Workspace } from "../../../../index"
import { workspaceMutationService } from "../../../services"

/**
 * Sets or clears the editor-only repeat preview state on a single node. Repeat
 * follows the override model: instances inherit their template's repeat at read
 * time via `resolveNodeRepeat`, so this writes only the targeted node and never
 * propagates to instances.
 */
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
