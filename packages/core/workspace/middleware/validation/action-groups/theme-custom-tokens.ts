import { themeEntryValidators } from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type { Action, Workspace } from "../../../types"

export function validateAddThemeCustomToken(
  workspace: Workspace,
  action: Action,
): void {
  const payload = action.payload as { themeId: string; name?: string }
  themeEntryValidators.isVariant(workspace, payload.themeId)
  if (!payload.name?.trim()) {
    throw new WorkspaceValidationError(
      "Custom theme token name is required",
      action,
    )
  }
}

export function validateRemoveThemeCustomToken(
  workspace: Workspace,
  action: Action,
): void {
  const payload = action.payload as { themeId: string; key: string }
  themeEntryValidators.isVariant(workspace, payload.themeId)
  const section = action.type.slice("remove_theme_custom_".length)
  themeEntryValidators.customTokenExists(
    workspace,
    payload.themeId,
    section,
    payload.key,
  )
}
