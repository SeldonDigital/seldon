import type { ExtractPayload, Workspace } from "../../../../index"
import {
  workspaceMutationService,
  workspacePropagationService,
} from "../../../services"

/** Sets or clears the editor-only repeat preview state on a node. */
export function setNodeRepeat(
  payload: ExtractPayload<"set_node_repeat">,
  workspace: Workspace,
): Workspace {
  return workspacePropagationService.propagatePositionalChildOperation({
    childId: payload.nodeId,
    propagation: "downstream",
    applyToChild: (childId, workspace) =>
      workspaceMutationService.setNodeRepeat(childId, payload.repeat, workspace),
    workspace,
  })
}
