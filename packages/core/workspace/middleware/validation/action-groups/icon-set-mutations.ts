import { iconSetEntryValidators } from "../validators/icon-set-entry"
import type { Action, Workspace } from "../../../types"

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
    case "set_icon_set_subcategory_preset":
    case "duplicate_icon_set":
      iconSetEntryValidators.exists(workspace, iconSetIdOf(action))
      break
  }
}
