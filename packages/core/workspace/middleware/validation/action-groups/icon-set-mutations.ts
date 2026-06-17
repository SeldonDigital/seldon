import { isEntryIconSetDefault } from "../../../model/entry-icon-set"
import type { Action, Workspace } from "../../../types"
import { iconSetEntryValidators } from "../validators/icon-set-entry"
import { WorkspaceValidationError } from "../workspace-validation-error"

function iconSetIdOf(action: Action): string {
  return (action.payload as { iconSetId: string }).iconSetId
}

export function validateIconSetMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "set_icon_set_label":
    case "set_icon_set_override":
    case "reset_icon_set_override":
    case "reset_icon_set":
    case "set_icon_set_subcategory_preset":
    case "duplicate_icon_set":
      iconSetEntryValidators.exists(workspace, iconSetIdOf(action))
      break
    case "delete_icon_set": {
      const id = iconSetIdOf(action)
      iconSetEntryValidators.exists(workspace, id)
      assertIconSetDeletable(workspace, id, action)
      break
    }
  }
}

/** Rejects deleting the default icon set entry. */
function assertIconSetDeletable(
  workspace: Workspace,
  id: string,
  action: Action,
): void {
  const entry = workspace["icon-sets"][id]
  if (entry && isEntryIconSetDefault(entry)) {
    throw new WorkspaceValidationError(
      "Cannot remove default icon set entry",
      action,
    )
  }
}
