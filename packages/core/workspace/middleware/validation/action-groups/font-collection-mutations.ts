import { isEntryFontCollectionDefault } from "../../../model/entry-font-collection"
import type { Action, Workspace } from "../../../types"
import { fontCollectionEntryValidators } from "../validators/font-collection-entry"
import { WorkspaceValidationError } from "../workspace-validation-error"

function fontCollectionIdOf(action: Action): string {
  return (action.payload as { fontCollectionId: string }).fontCollectionId
}

export function validateFontCollectionMutation(
  workspace: Workspace,
  action: Action,
): void {
  switch (action.type) {
    case "reset_font_collection_label":
    case "reset_font_collection_editor_data":
    case "reset_font_collection_override":
    case "reset_font_collection":
    case "set_font_collection_label":
    case "set_font_collection_editor_data":
    case "duplicate_font_collection":
      fontCollectionEntryValidators.exists(
        workspace,
        fontCollectionIdOf(action),
      )
      break
    case "set_font_collection_override":
      fontCollectionEntryValidators.exists(
        workspace,
        fontCollectionIdOf(action),
      )
      assertNonEmptyOverridePath(action, "Font collection override")
      break
    case "set_font_collection_family_variant":
      fontCollectionEntryValidators.exists(
        workspace,
        fontCollectionIdOf(action),
      )
      assertFamilyVariantPayload(action)
      break
    case "set_font_collection_family_preset":
      fontCollectionEntryValidators.exists(
        workspace,
        fontCollectionIdOf(action),
      )
      assertFamilyPresetPayload(action)
      break
    case "delete_font_collection": {
      const id = action.payload.fontCollectionId
      fontCollectionEntryValidators.exists(workspace, id)
      assertFontCollectionDeletable(workspace, id, action)
      break
    }
  }
}

const FAMILY_PRESETS = new Set<string>(["all", "none"])

/** Rejects a `set_*_override` whose path is empty or not a string. */
function assertNonEmptyOverridePath(action: Action, label: string): void {
  const path = (action.payload as { path?: unknown }).path
  if (typeof path !== "string" || path.length === 0) {
    throw new WorkspaceValidationError(
      `${label} path must be a non-empty string`,
      action,
    )
  }
}

/** Validates the slot, variant, and enabled fields on a family-variant edit. */
function assertFamilyVariantPayload(action: Action): void {
  const payload = action.payload as {
    slot?: unknown
    variant?: unknown
    enabled?: unknown
  }
  if (typeof payload.slot !== "string" || payload.slot.length === 0) {
    throw new WorkspaceValidationError(
      "Family slot must be a non-empty string",
      action,
    )
  }
  if (typeof payload.variant !== "string" || payload.variant.length === 0) {
    throw new WorkspaceValidationError(
      "Family variant must be a non-empty string",
      action,
    )
  }
  if (typeof payload.enabled !== "boolean") {
    throw new WorkspaceValidationError(
      "Family variant enabled must be a boolean",
      action,
    )
  }
}

/** Validates the slot and preset fields on a family-preset edit. */
function assertFamilyPresetPayload(action: Action): void {
  const payload = action.payload as { slot?: unknown; preset?: unknown }
  if (typeof payload.slot !== "string" || payload.slot.length === 0) {
    throw new WorkspaceValidationError(
      "Family slot must be a non-empty string",
      action,
    )
  }
  if (
    typeof payload.preset !== "string" ||
    !FAMILY_PRESETS.has(payload.preset)
  ) {
    throw new WorkspaceValidationError(
      'Family preset must be "all" or "none"',
      action,
    )
  }
}

/** Rejects deleting the default font collection entry. */
function assertFontCollectionDeletable(
  workspace: Workspace,
  id: string,
  action: Action,
): void {
  const entry = workspace["font-collections"][id]
  if (entry && isEntryFontCollectionDefault(entry)) {
    throw new WorkspaceValidationError(
      "Cannot remove default font collection entry",
      action,
    )
  }
}

export function validateAddFontCollectionCustomFamily(
  workspace: Workspace,
  action: Action,
): void {
  const payload = action.payload as { fontCollectionId: string; name?: string }
  fontCollectionEntryValidators.isVariant(workspace, payload.fontCollectionId)
  if (!payload.name?.trim()) {
    throw new WorkspaceValidationError(
      "Custom font family name is required",
      action,
    )
  }
}

export function validateRemoveFontCollectionCustomFamily(
  workspace: Workspace,
  action: Action,
): void {
  const payload = action.payload as { fontCollectionId: string; key: string }
  fontCollectionEntryValidators.isVariant(workspace, payload.fontCollectionId)
  fontCollectionEntryValidators.customFamilyExists(
    workspace,
    payload.fontCollectionId,
    payload.key,
  )
}
