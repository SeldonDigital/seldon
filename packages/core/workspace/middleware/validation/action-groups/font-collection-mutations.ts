import { isEntryFontCollectionDefault } from "../../../model/entry-font-collection"
import { fontCollectionEntryValidators } from "../validators/font-collection-entry"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type { Action, Workspace } from "../../../types"

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
    case "set_font_collection_label":
    case "set_font_collection_editor_data":
    case "set_font_collection_override":
    case "duplicate_font_collection":
      fontCollectionEntryValidators.exists(workspace, fontCollectionIdOf(action))
      break
    case "delete_font_collection": {
      const id = action.payload.fontCollectionId
      fontCollectionEntryValidators.exists(workspace, id)
      const entry = workspace["font-collections"][id]
      if (entry && isEntryFontCollectionDefault(entry)) {
        throw new WorkspaceValidationError(
          "Cannot remove default font collection entry",
          action,
        )
      }
      break
    }
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
