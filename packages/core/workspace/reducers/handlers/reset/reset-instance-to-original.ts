import { ExtractPayload, Workspace } from "../../../../index"
import { rules } from "../../../../rules/config/rules.config"
import {
  nodeRetrievalService,
  typeCheckingService,
  workspaceMutationService,
} from "../../../services"

/**
 * Reverts an instance to the terminal of its template chain (its original).
 * Clears the instance subtree overrides and repoints each node's template to its
 * resolved original. Node ids survive, so downstream instances keep their links
 * and their own overrides.
 */
export function resetInstanceToOriginal(
  payload: ExtractPayload<"reset_instance_to_original">,
  workspace: Workspace,
): Workspace {
  if (rules.mutations.reset.instance.allowed === false) {
    return workspace
  }

  const node = nodeRetrievalService.getNode(payload.instanceId, workspace)
  if (!typeCheckingService.isInstance(node)) {
    return workspace
  }

  return workspaceMutationService.resetInstanceToOriginal(
    payload.instanceId,
    workspace,
  )
}
