import { validateComponentMetadata } from "./action-groups/component-metadata"
import {
  validateAddFontCollectionCustomFamily,
  validateFontCollectionMutation,
  validateRemoveFontCollectionCustomFamily,
} from "./action-groups/font-collection-mutations"
import {
  validateAddVariant,
  validateDuplicateNode,
  validateInsertMutation,
  validateNodeMutation,
  validateReorderBoard,
  validateReorderVariantInBoard,
  validateThemeMutation,
} from "./action-groups/node-mutations"
import { isPassthroughAction } from "./action-groups/passthrough"
import {
  validateAddResourceCatalog,
  validateDuplicateComponent,
  validateRemoveBoard,
} from "./action-groups/resource-catalog"
import {
  validateAddThemeCustomToken,
  validateRemoveThemeCustomToken,
} from "./action-groups/theme-custom-tokens"
import { componentValidators } from "./validators"
import { WorkspaceValidationError } from "./workspace-validation-error"
import type { Action, Workspace } from "../../types"

/**
 * Validates a workspace action before the reducer runs.
 * Throws {@link WorkspaceValidationError} when validation fails.
 */
export function validateAction(workspace: Workspace, action: Action): void {
  if (isPassthroughAction(action.type)) {
    return
  }

  if (action.type.startsWith("add_theme_custom_")) {
    validateAddThemeCustomToken(workspace, action)
    return
  }

  if (action.type.startsWith("remove_theme_custom_")) {
    validateRemoveThemeCustomToken(workspace, action)
    return
  }

  if (action.type === "add_font_collection_custom_family") {
    validateAddFontCollectionCustomFamily(workspace, action)
    return
  }

  if (action.type === "remove_font_collection_custom_family") {
    validateRemoveFontCollectionCustomFamily(workspace, action)
    return
  }

  switch (action.type) {
    case "add_component":
      componentValidators.doesNotExist(workspace, action.payload.componentId)
      return
    case "add_font_collection":
    case "add_media":
    case "add_icon_set":
    case "add_theme":
      validateAddResourceCatalog(workspace, action)
      return
    case "add_playground":
      componentValidators.doesNotExist(workspace, action.payload.componentKey)
      return
    case "add_variant":
      validateAddVariant(workspace, action)
      return
    case "duplicate_node":
      validateDuplicateNode(workspace, action)
      return
    case "reorder_board":
      validateReorderBoard(workspace, action)
      return
    case "reorder_variant_in_board":
      validateReorderVariantInBoard(workspace, action)
      return
    case "duplicate_component":
      validateDuplicateComponent(workspace, action)
      return
    case "remove_component":
    case "remove_playground":
    case "remove_font_collection":
    case "remove_media":
    case "remove_icon_set":
    case "remove_theme":
      validateRemoveBoard(workspace, action)
      return
    case "add_component_and_insert_default_instance":
    case "insert_variant_instance":
    case "insert_duplicate_instance":
    case "insert_default_instance":
    case "move_instance":
      validateInsertMutation(workspace, action)
      return
    case "reorder_instance_in_parent":
    case "remove_instance":
    case "remove_variant":
    case "set_node_properties":
    case "reset_node_property":
    case "reset_node":
    case "set_node_theme":
    case "set_node_label":
    case "set_node_editor_data":
    case "reset_node_label":
    case "reset_node_editor_data":
    case "reset_user_variant_to_default":
      validateNodeMutation(workspace, action)
      return
    case "reset_theme_tokens":
    case "reset_theme_label":
    case "reset_theme_editor_data":
    case "reset_theme_override":
    case "set_theme_label":
    case "set_theme_editor_data":
    case "set_theme_override":
    case "delete_theme":
    case "duplicate_theme":
      validateThemeMutation(workspace, action)
      return
    case "reset_font_collection_label":
    case "reset_font_collection_editor_data":
    case "reset_font_collection_override":
    case "set_font_collection_label":
    case "set_font_collection_editor_data":
    case "set_font_collection_override":
    case "set_font_collection_family_variant":
    case "set_font_collection_family_preset":
    case "delete_font_collection":
    case "duplicate_font_collection":
      validateFontCollectionMutation(workspace, action)
      return
    case "set_component_label":
    case "set_component_intent":
    case "set_component_tags":
    case "set_component_editor_data":
    case "reset_component_label":
    case "reset_component_intent":
    case "reset_component_tags":
    case "reset_component_editor_data":
    case "set_component_license":
    case "reset_component_license":
    case "set_component_author":
    case "reset_component_author":
    case "set_component_credentials":
    case "reset_component_credentials":
    case "set_component_preview":
    case "reset_component_preview":
    case "set_component_properties":
    case "reset_component_property":
    case "set_component_theme":
      validateComponentMetadata(workspace, action)
      return
    default:
      if (process.env.NODE_ENV === "development") {
        throw new WorkspaceValidationError(
          `No validation handler registered for action type "${action.type}"`,
          action,
        )
      }
  }
}
