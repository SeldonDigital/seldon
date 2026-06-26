import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
} from "../../../services"

/**
 * Reverts an instance to the node one hop up its template chain (its source).
 * Clears the instance subtree overrides and repoints each node's template to the
 * source's structurally-matching child, so a child resolves to the source
 * variant's child rather than to its own template baseline. Node ids survive, so
 * downstream instances keep their links and their own overrides.
 */
export function resetInstanceToSource(
  payload: ExtractPayload<"reset_instance_to_source">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.reset.instance.allowed === false) {
    return workspace
  }

  const node = nodeRetrievalService.getNode(payload.instanceId, workspace)
  if (!typeCheckingService.isInstance(node)) {
    return workspace
  }

  return workspaceMutationService.resetInstanceToSource(
    payload.instanceId,
    workspace,
  )
}
