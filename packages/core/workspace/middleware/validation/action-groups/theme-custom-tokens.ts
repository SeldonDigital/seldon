import { Unit } from "../../../../properties/constants/shared/units"
import { isReservedTokenName } from "../../../../themes/helpers"
import type { Action, Workspace } from "../../../types"
import { themeEntryValidators } from "../validators"
import { WorkspaceValidationError } from "../workspace-validation-error"

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

export function validateSetThemeScaleSlot(
  workspace: Workspace,
  action: Action,
): void {
  const payload = action.payload as {
    themeId: string
    section: string
    key: string
    value?: { kind?: string; parameters?: { unit?: unknown; value?: unknown } }
  }
  themeEntryValidators.isVariant(workspace, payload.themeId)

  if (!payload.key?.trim()) {
    throw new WorkspaceValidationError("Scale slot key is required", action)
  }

  const value = payload.value
  if (!value || (value.kind !== "modulated" && value.kind !== "exact")) {
    throw new WorkspaceValidationError(
      "Scale slot value must be modulated or exact",
      action,
    )
  }

  if (value.kind === "exact") {
    const unit = value.parameters?.unit
    const numeric = value.parameters?.value
    if (unit !== Unit.PX && unit !== Unit.REM) {
      throw new WorkspaceValidationError(
        "Exact scale slot unit must be px or rem",
        action,
      )
    }
    if (typeof numeric !== "number" || !Number.isFinite(numeric)) {
      throw new WorkspaceValidationError(
        "Exact scale slot value must be a finite number",
        action,
      )
    }
  }
}

export function validateSetThemeCustomTokenName(
  workspace: Workspace,
  action: Action,
): void {
  const payload = action.payload as {
    themeId: string
    section: string
    key: string
    name: string
  }
  themeEntryValidators.isVariant(workspace, payload.themeId)
  themeEntryValidators.customTokenExists(
    workspace,
    payload.themeId,
    payload.section,
    payload.key,
  )
  if (!payload.name?.trim()) {
    throw new WorkspaceValidationError(
      "Custom theme token name is required",
      action,
    )
  }
  if (isReservedTokenName(payload.section, payload.name)) {
    throw new WorkspaceValidationError(
      `"${payload.name}" is a reserved ${payload.section} token name`,
      action,
    )
  }
}
