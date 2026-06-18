import type { Action, Workspace } from "../../types"
import { validateBoardMetadata } from "./action-groups/board-metadata"
import {
  validateAddFontCollectionCustomFamily,
  validateFontCollectionMutation,
  validateRemoveFontCollectionCustomFamily,
} from "./action-groups/font-collection-mutations"
import { validateIconSetMutation } from "./action-groups/icon-set-mutations"
import {
  validateAddNodeLayer,
  validateRemoveNodeLayer,
  validateReorderNodeLayer,
  validateSetNodeLayerKind,
} from "./action-groups/node-layers"
import {
  validateAddVariant,
  validateDuplicateNode,
  validateInsertMutation,
  validateNodeMutation,
  validateReorderBoard,
  validateReorderVariantInBoard,
  validateResetComponentToCatalog,
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
  validateSetThemeCustomTokenName,
  validateSetThemeScaleSlot,
} from "./action-groups/theme-custom-tokens"
import { boardValidators } from "./validators"
import { WorkspaceValidationError } from "./workspace-validation-error"

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

  if (action.type === "set_theme_scale_slot") {
    validateSetThemeScaleSlot(workspace, action)
    return
  }

  if (action.type === "set_theme_custom_token_name") {
    validateSetThemeCustomTokenName(workspace, action)
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
      boardValidators.doesNotExist(workspace, action.payload.boardKey)
      return
    case "add_font_collection":
    case "add_media":
    case "add_icon_set":
    case "add_theme":
      validateAddResourceCatalog(workspace, action)
      return
    case "add_playground":
      boardValidators.playgroundKeyIsFree(workspace, action.payload.boardKey)
      return
    case "add_sandbox":
      boardValidators.playgroundExists(workspace, action.payload.playgroundKey)
      return
    case "set_playground_label":
      boardValidators.playgroundExists(workspace, action.payload.playgroundKey)
      return
    case "duplicate_playground":
      boardValidators.playgroundExists(
        workspace,
        action.payload.sourcePlaygroundKey,
      )
      boardValidators.playgroundKeyIsFree(
        workspace,
        action.payload.newPlaygroundKey,
      )
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
    case "remove_playground":
      boardValidators.playgroundExists(workspace, action.payload.boardKey)
      return
    case "remove_component":
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
    case "move_instance_directional":
    case "remove_instance":
    case "remove_variant":
    case "set_node_properties":
    case "reset_node_property":
    case "reset_node":
      validateNodeMutation(workspace, action)
      return
    case "add_node_layer":
      validateAddNodeLayer(workspace, action)
      return
    case "remove_node_layer":
      validateRemoveNodeLayer(workspace, action)
      return
    case "reorder_node_layer":
      validateReorderNodeLayer(workspace, action)
      return
    case "set_node_layer_kind":
      validateSetNodeLayerKind(workspace, action)
      return
    case "set_node_theme":
    case "set_node_label":
    case "set_node_ref":
    case "set_node_editor_data":
    case "reset_node_label":
    case "reset_node_editor_data":
    case "reset_user_variant_to_default":
    case "reset_default_variant_to_catalog":
      validateNodeMutation(workspace, action)
      return
    case "reset_component_to_catalog":
      validateResetComponentToCatalog(workspace, action)
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
    case "reset_font_collection":
    case "set_font_collection_label":
    case "set_font_collection_editor_data":
    case "set_font_collection_override":
    case "set_font_collection_family_variant":
    case "set_font_collection_family_preset":
    case "delete_font_collection":
    case "duplicate_font_collection":
      validateFontCollectionMutation(workspace, action)
      return
    case "set_icon_set_label":
    case "set_icon_set_override":
    case "reset_icon_set_override":
    case "reset_icon_set":
    case "set_icon_set_subcategory_preset":
    case "delete_icon_set":
    case "duplicate_icon_set":
      validateIconSetMutation(workspace, action)
      return
    case "set_board_label":
    case "set_board_intent":
    case "set_board_tags":
    case "set_board_editor_data":
    case "reset_board_label":
    case "reset_board_intent":
    case "reset_board_tags":
    case "reset_board_editor_data":
    case "set_board_license":
    case "reset_board_license":
    case "set_board_author":
    case "reset_board_author":
    case "set_board_credentials":
    case "reset_board_credentials":
    case "set_board_preview":
    case "reset_board_preview":
    case "set_component_properties":
    case "reset_component_property":
    case "set_component_theme":
      validateBoardMetadata(workspace, action)
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
