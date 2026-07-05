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
    case "reset_icon_set_override":
    case "reset_icon_set":
    case "duplicate_icon_set":
      iconSetEntryValidators.exists(workspace, iconSetIdOf(action))
      break
    case "set_icon_set_override":
      iconSetEntryValidators.exists(workspace, iconSetIdOf(action))
      assertNonEmptyOverridePath(action)
      break
    case "set_icon_set_subcategory_preset":
      iconSetEntryValidators.exists(workspace, iconSetIdOf(action))
      assertSubcategoryPresetPayload(action)
      break
    case "delete_icon_set": {
      const id = iconSetIdOf(action)
      iconSetEntryValidators.exists(workspace, id)
      assertIconSetDeletable(workspace, id, action)
      break
    }
  }
}

const SUBCATEGORY_PRESETS = new Set<string>(["all", "none"])

/** Rejects a `set_icon_set_override` whose path is empty or not a string. */
function assertNonEmptyOverridePath(action: Action): void {
  const path = (action.payload as { path?: unknown }).path
  if (typeof path !== "string" || path.length === 0) {
    throw new WorkspaceValidationError(
      "Icon set override path must be a non-empty string",
      action,
    )
  }
}

/** Validates the subcategory and preset fields on a subcategory-preset edit. */
function assertSubcategoryPresetPayload(action: Action): void {
  const payload = action.payload as { subcategory?: unknown; preset?: unknown }
  if (
    typeof payload.subcategory !== "string" ||
    payload.subcategory.length === 0
  ) {
    throw new WorkspaceValidationError(
      "Icon set subcategory must be a non-empty string",
      action,
    )
  }
  if (
    typeof payload.preset !== "string" ||
    !SUBCATEGORY_PRESETS.has(payload.preset)
  ) {
    throw new WorkspaceValidationError(
      'Icon set subcategory preset must be "all" or "none"',
      action,
    )
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
