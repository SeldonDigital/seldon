import { ExtractPayload, Workspace } from "../../../../index"

/**
 * Icon set catalog boards are never deleted; validation rejects this action.
 */
export function removeIconSet(
  _payload: ExtractPayload<"remove_icon_set">,
  workspace: Workspace,
): Workspace {
  return workspace
}
