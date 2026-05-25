import { ExtractPayload, Workspace } from "../../../../index"

/**
 * Theme catalog boards are never deleted; validation rejects this action.
 */
export function removeTheme(
  _payload: ExtractPayload<"remove_theme">,
  workspace: Workspace,
): Workspace {
  return workspace
}
