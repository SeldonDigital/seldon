import { applyMiddleware } from "../middleware/compose/apply-middleware"
import { migrationMiddleware } from "../middleware/migration/middleware"
import { debugMiddleware } from "../middleware/observability/debug.middleware"
import { validationMiddleware } from "../middleware/validation/validation.middleware"
import { workspaceVerificationMiddleware } from "../middleware/verification/verification.middleware"
import type { Workspace } from "../model/workspace"
import type { VariantId, WorkspaceAction } from "../types"
import { addComponent } from "./handlers/add/add-component"
import { addFontCollection } from "./handlers/add/add-font-collection"
import { addFontCollectionCustomFamily } from "./handlers/add/add-font-collection-custom-family"
import { addIconSet } from "./handlers/add/add-icon-set"
import { addMedia } from "./handlers/add/add-media"
import { addPlayground } from "./handlers/add/add-playground"
import { addTheme } from "./handlers/add/add-theme"
import { addThemeCustomBackground } from "./handlers/add/add-theme-custom-background"
import { addThemeCustomBlur } from "./handlers/add/add-theme-custom-blur"
import { addThemeCustomBorder } from "./handlers/add/add-theme-custom-border"
import { addThemeCustomBorderWidth } from "./handlers/add/add-theme-custom-border-width"
import { addThemeCustomCorners } from "./handlers/add/add-theme-custom-corners"
import { addThemeCustomDimension } from "./handlers/add/add-theme-custom-dimension"
import { addThemeCustomFont } from "./handlers/add/add-theme-custom-font"
import { addThemeCustomFontSize } from "./handlers/add/add-theme-custom-font-size"
import { addThemeCustomFontWeight } from "./handlers/add/add-theme-custom-font-weight"
import { addThemeCustomGap } from "./handlers/add/add-theme-custom-gap"
import { addThemeCustomGradient } from "./handlers/add/add-theme-custom-gradient"
import { addThemeCustomLineHeight } from "./handlers/add/add-theme-custom-line-height"
import { addThemeCustomMargin } from "./handlers/add/add-theme-custom-margin"
import { addThemeCustomPadding } from "./handlers/add/add-theme-custom-padding"
import { addThemeCustomScrollbar } from "./handlers/add/add-theme-custom-scrollbar"
import { addThemeCustomShadow } from "./handlers/add/add-theme-custom-shadow"
import { addThemeCustomSize } from "./handlers/add/add-theme-custom-size"
import { addThemeCustomSpread } from "./handlers/add/add-theme-custom-spread"
import { addThemeCustomSwatch } from "./handlers/add/add-theme-custom-swatch"
import { addVariant } from "./handlers/add/add-variant"
import { duplicateComponent } from "./handlers/duplicate/duplicate-component"
import { duplicateFontCollection } from "./handlers/duplicate/duplicate-font-collection"
import { duplicateIconSet } from "./handlers/duplicate/duplicate-icon-set"
import { duplicateNode } from "./handlers/duplicate/duplicate-node"
import { duplicateTheme } from "./handlers/duplicate/duplicate-theme"
import { insertDefaultInstance } from "./handlers/insert/insert-default-instance"
import { insertDuplicateInstance } from "./handlers/insert/insert-duplicate-instance"
import { insertVariantInstance } from "./handlers/insert/insert-variant-instance"
import { moveInstance } from "./handlers/move/move-instance"
import { normalizeMetadataVersion } from "./handlers/normalize/normalize-metadata-version"
import { deleteFontCollection } from "./handlers/remove/delete-font-collection"
import { deleteIconSet } from "./handlers/remove/delete-icon-set"
import { deleteTheme } from "./handlers/remove/delete-theme"
import { removeComponent } from "./handlers/remove/remove-component"
import { removeFontCollection } from "./handlers/remove/remove-font-collection"
import { removeFontCollectionCustomFamily } from "./handlers/remove/remove-font-collection-custom-family"
import { removeIconSet } from "./handlers/remove/remove-icon-set"
import { removeInstance } from "./handlers/remove/remove-instance"
import { removeMedia } from "./handlers/remove/remove-media"
import { removePlayground } from "./handlers/remove/remove-playground"
import { removeTheme } from "./handlers/remove/remove-theme"
import { removeThemeCustomBackground } from "./handlers/remove/remove-theme-custom-background"
import { removeThemeCustomBlur } from "./handlers/remove/remove-theme-custom-blur"
import { removeThemeCustomBorder } from "./handlers/remove/remove-theme-custom-border"
import { removeThemeCustomBorderWidth } from "./handlers/remove/remove-theme-custom-border-width"
import { removeThemeCustomCorners } from "./handlers/remove/remove-theme-custom-corners"
import { removeThemeCustomDimension } from "./handlers/remove/remove-theme-custom-dimension"
import { removeThemeCustomFont } from "./handlers/remove/remove-theme-custom-font"
import { removeThemeCustomFontSize } from "./handlers/remove/remove-theme-custom-font-size"
import { removeThemeCustomFontWeight } from "./handlers/remove/remove-theme-custom-font-weight"
import { removeThemeCustomGap } from "./handlers/remove/remove-theme-custom-gap"
import { removeThemeCustomGradient } from "./handlers/remove/remove-theme-custom-gradient"
import { removeThemeCustomLineHeight } from "./handlers/remove/remove-theme-custom-line-height"
import { removeThemeCustomMargin } from "./handlers/remove/remove-theme-custom-margin"
import { removeThemeCustomPadding } from "./handlers/remove/remove-theme-custom-padding"
import { removeThemeCustomScrollbar } from "./handlers/remove/remove-theme-custom-scrollbar"
import { removeThemeCustomShadow } from "./handlers/remove/remove-theme-custom-shadow"
import { removeThemeCustomSize } from "./handlers/remove/remove-theme-custom-size"
import { removeThemeCustomSpread } from "./handlers/remove/remove-theme-custom-spread"
import { removeThemeCustomSwatch } from "./handlers/remove/remove-theme-custom-swatch"
import { removeVariant } from "./handlers/remove/remove-variant"
import { reorderBoard } from "./handlers/reorder/reorder-board"
import { reorderInstanceInParent } from "./handlers/reorder/reorder-instance-in-parent"
import { reorderVariantInBoard } from "./handlers/reorder/reorder-variant-in-board"
import { resetComponentAuthor } from "./handlers/reset/reset-component-author"
import { resetComponentCredentials } from "./handlers/reset/reset-component-credentials"
import { resetComponentEditorData } from "./handlers/reset/reset-component-editor-data"
import { resetComponentIntent } from "./handlers/reset/reset-component-intent"
import { resetComponentLabel } from "./handlers/reset/reset-component-label"
import { resetComponentLicense } from "./handlers/reset/reset-component-license"
import { resetComponentPreview } from "./handlers/reset/reset-component-preview"
import { resetComponentProperty } from "./handlers/reset/reset-component-property"
import { resetComponentTags } from "./handlers/reset/reset-component-tags"
import { resetDefaultVariantToCatalog } from "./handlers/reset/reset-default-variant-to-catalog"
import { resetFontCollectionEditorData } from "./handlers/reset/reset-font-collection-editor-data"
import { resetFontCollectionLabel } from "./handlers/reset/reset-font-collection-label"
import { resetFontCollectionOverride } from "./handlers/reset/reset-font-collection-override"
import { resetIconSetOverride } from "./handlers/reset/reset-icon-set-override"
import { resetNode } from "./handlers/reset/reset-node"
import { resetNodeEditorData } from "./handlers/reset/reset-node-editor-data"
import { resetNodeLabel } from "./handlers/reset/reset-node-label"
import { resetNodeProperty } from "./handlers/reset/reset-node-property"
import { resetThemeEditorData } from "./handlers/reset/reset-theme-editor-data"
import { resetThemeLabel } from "./handlers/reset/reset-theme-label"
import { resetThemeOverride } from "./handlers/reset/reset-theme-override"
import { resetThemeTokens } from "./handlers/reset/reset-theme-tokens"
import { resetUserVariantToDefault } from "./handlers/reset/reset-user-variant-to-default"
import { resetWorkspaceIntent } from "./handlers/reset/reset-workspace-intent"
import { resetWorkspaceLabel } from "./handlers/reset/reset-workspace-label"
import { resetWorkspaceLastUpdate } from "./handlers/reset/reset-workspace-last-update"
import { resetWorkspaceLicense } from "./handlers/reset/reset-workspace-license"
import { resetWorkspaceOwner } from "./handlers/reset/reset-workspace-owner"
import { resetWorkspaceTags } from "./handlers/reset/reset-workspace-tags"
import { setComponentAuthor } from "./handlers/set/set-component-author"
import { setComponentCredentials } from "./handlers/set/set-component-credentials"
import { setComponentEditorData } from "./handlers/set/set-component-editor-data"
import { setComponentIntent } from "./handlers/set/set-component-intent"
import { setComponentLabel } from "./handlers/set/set-component-label"
import { setComponentLicense } from "./handlers/set/set-component-license"
import { setComponentPreview } from "./handlers/set/set-component-preview"
import { setComponentProperties } from "./handlers/set/set-component-properties"
import { setComponentTags } from "./handlers/set/set-component-tags"
import { setComponentTheme } from "./handlers/set/set-component-theme"
import { setFontCollectionEditorData } from "./handlers/set/set-font-collection-editor-data"
import { setFontCollectionFamilyPreset } from "./handlers/set/set-font-collection-family-preset"
import { setFontCollectionFamilyVariant } from "./handlers/set/set-font-collection-family-variant"
import { setFontCollectionLabel } from "./handlers/set/set-font-collection-label"
import { setFontCollectionOverride } from "./handlers/set/set-font-collection-override"
import { setIconSetLabel } from "./handlers/set/set-icon-set-label"
import { setIconSetOverride } from "./handlers/set/set-icon-set-override"
import { setIconSetSubcategoryPreset } from "./handlers/set/set-icon-set-subcategory-preset"
import { setNodeEditorData } from "./handlers/set/set-node-editor-data"
import { setNodeLabel } from "./handlers/set/set-node-label"
import { setNodeProperties } from "./handlers/set/set-node-properties"
import { setNodeTheme } from "./handlers/set/set-node-theme"
import { setThemeEditorData } from "./handlers/set/set-theme-editor-data"
import { setThemeLabel } from "./handlers/set/set-theme-label"
import { setThemeOverride } from "./handlers/set/set-theme-override"
import { setWorkspace } from "./handlers/set/set-workspace"
import { setWorkspaceIntent } from "./handlers/set/set-workspace-intent"
import { setWorkspaceLabel } from "./handlers/set/set-workspace-label"
import { setWorkspaceLastUpdate } from "./handlers/set/set-workspace-last-update"
import { setWorkspaceLicense } from "./handlers/set/set-workspace-license"
import { setWorkspaceOwner } from "./handlers/set/set-workspace-owner"
import { setWorkspaceTags } from "./handlers/set/set-workspace-tags"
import { setWorkspaceVersion } from "./handlers/set/set-workspace-version"
import { stubsResourceMapNoop } from "./handlers/stubs/stubs-resource-maps"

function reducer(workspace: Workspace, action: WorkspaceAction): Workspace {
  switch (action.type) {
    case "set_workspace":
      return setWorkspace(action.payload)

    case "set_workspace_owner":
      return setWorkspaceOwner(action.payload, workspace)
    case "set_workspace_label":
      return setWorkspaceLabel(action.payload, workspace)
    case "set_workspace_version":
      return setWorkspaceVersion(action.payload, workspace)
    case "set_workspace_last_update":
      return setWorkspaceLastUpdate(action.payload, workspace)
    case "set_workspace_intent":
      return setWorkspaceIntent(action.payload, workspace)
    case "set_workspace_tags":
      return setWorkspaceTags(action.payload, workspace)
    case "set_workspace_license":
      return setWorkspaceLicense(action.payload, workspace)

    case "reset_workspace_owner":
      return resetWorkspaceOwner(action.payload, workspace)
    case "reset_workspace_label":
      return resetWorkspaceLabel(action.payload, workspace)
    case "normalize_metadata_version":
      return normalizeMetadataVersion(action.payload, workspace)
    case "reset_workspace_last_update":
      return resetWorkspaceLastUpdate(action.payload, workspace)
    case "reset_workspace_intent":
      return resetWorkspaceIntent(action.payload, workspace)
    case "reset_workspace_tags":
      return resetWorkspaceTags(action.payload, workspace)
    case "reset_workspace_license":
      return resetWorkspaceLicense(action.payload, workspace)

    case "add_component":
      return addComponent(action.payload, workspace)
    case "add_font_collection":
      return addFontCollection(action.payload, workspace)
    case "add_media":
      return addMedia(action.payload, workspace)
    case "add_icon_set":
      return addIconSet(action.payload, workspace)
    case "add_theme":
      return addTheme(action.payload, workspace)
    case "add_playground":
      return addPlayground(action.payload, workspace)
    case "add_component_and_insert_default_instance": {
      const { componentId, target, variantFallbacks } = action.payload
      const workspaceWithBoard = addComponent(
        { componentId, variantFallbacks },
        workspace,
      )
      const board = workspaceWithBoard.components[componentId]
      const rootId = board?.variants[0]?.id
      if (!rootId) return workspaceWithBoard
      return insertVariantInstance(
        {
          variantId: rootId as VariantId,
          target: {
            parentId: target.parentId,
            index: target.index,
          },
        },
        workspaceWithBoard,
      )
    }

    case "remove_component":
      return removeComponent(action.payload, workspace)
    case "remove_font_collection":
      return removeFontCollection(action.payload, workspace)
    case "remove_media":
      return removeMedia(action.payload, workspace)
    case "remove_icon_set":
      return removeIconSet(action.payload, workspace)
    case "remove_theme":
      return removeTheme(action.payload, workspace)
    case "remove_playground":
      return removePlayground(action.payload, workspace)
    case "duplicate_component":
      return duplicateComponent(action.payload, workspace)
    case "reorder_board":
      return reorderBoard(action.payload, workspace)
    case "reorder_variant_in_board":
      return reorderVariantInBoard(action.payload, workspace)
    case "set_component_theme":
      return setComponentTheme(action.payload, workspace)
    case "set_component_properties":
      return setComponentProperties(action.payload, workspace)
    case "reset_component_property":
      return resetComponentProperty(action.payload, workspace)
    case "set_component_label":
      return setComponentLabel(action.payload, workspace)
    case "set_component_intent":
      return setComponentIntent(action.payload, workspace)
    case "set_component_tags":
      return setComponentTags(action.payload, workspace)
    case "set_component_license":
      return setComponentLicense(action.payload, workspace)
    case "set_component_author":
      return setComponentAuthor(action.payload, workspace)
    case "set_component_credentials":
      return setComponentCredentials(action.payload, workspace)
    case "set_component_preview":
      return setComponentPreview(action.payload, workspace)
    case "set_component_editor_data":
      return setComponentEditorData(action.payload, workspace)

    case "reset_component_label":
      return resetComponentLabel(action.payload, workspace)
    case "reset_component_intent":
      return resetComponentIntent(action.payload, workspace)
    case "reset_component_tags":
      return resetComponentTags(action.payload, workspace)
    case "reset_component_license":
      return resetComponentLicense(action.payload, workspace)
    case "reset_component_author":
      return resetComponentAuthor(action.payload, workspace)
    case "reset_component_credentials":
      return resetComponentCredentials(action.payload, workspace)
    case "reset_component_preview":
      return resetComponentPreview(action.payload, workspace)
    case "reset_component_editor_data":
      return resetComponentEditorData(action.payload, workspace)

    case "add_variant":
      return addVariant(action.payload, workspace)

    case "set_node_properties":
      return setNodeProperties(action.payload, workspace)
    case "reset_node_property":
      return resetNodeProperty(action.payload, workspace)
    case "reset_node":
      return resetNode(action.payload, workspace)
    case "set_node_label":
      return setNodeLabel(action.payload, workspace)
    case "set_node_theme":
      return setNodeTheme(action.payload, workspace)
    case "set_node_editor_data":
      return setNodeEditorData(action.payload, workspace)
    case "reset_node_label":
      return resetNodeLabel(action.payload, workspace)
    case "reset_node_editor_data":
      return resetNodeEditorData(action.payload, workspace)
    case "set_theme_label":
      return setThemeLabel(action.payload, workspace)
    case "set_theme_editor_data":
      return setThemeEditorData(action.payload, workspace)
    case "set_theme_override":
      return setThemeOverride(action.payload, workspace)
    case "remove_instance":
      return removeInstance(action.payload, workspace)
    case "remove_variant":
      return removeVariant(action.payload, workspace)
    case "duplicate_node":
      return duplicateNode(action.payload, workspace)
    case "reset_user_variant_to_default":
      return resetUserVariantToDefault(action.payload, workspace)
    case "reset_default_variant_to_catalog":
      return resetDefaultVariantToCatalog(action.payload, workspace)
    case "move_instance":
      return moveInstance(action.payload, workspace)
    case "reorder_instance_in_parent":
      return reorderInstanceInParent(action.payload, workspace)
    case "insert_variant_instance":
      return insertVariantInstance(action.payload, workspace)
    case "insert_duplicate_instance":
      return insertDuplicateInstance(action.payload, workspace)
    case "insert_default_instance":
      return insertDefaultInstance(action.payload, workspace)

    case "reset_theme_tokens":
      return resetThemeTokens(action.payload, workspace)
    case "reset_theme_label":
      return resetThemeLabel(action.payload, workspace)
    case "reset_theme_editor_data":
      return resetThemeEditorData(action.payload, workspace)
    case "reset_theme_override":
      return resetThemeOverride(action.payload, workspace)
    case "add_theme_custom_swatch":
      return addThemeCustomSwatch(action.payload, workspace)
    case "add_theme_custom_font":
      return addThemeCustomFont(action.payload, workspace)
    case "add_theme_custom_border":
      return addThemeCustomBorder(action.payload, workspace)
    case "add_theme_custom_background":
      return addThemeCustomBackground(action.payload, workspace)
    case "add_theme_custom_gradient":
      return addThemeCustomGradient(action.payload, workspace)
    case "add_theme_custom_shadow":
      return addThemeCustomShadow(action.payload, workspace)
    case "add_theme_custom_scrollbar":
      return addThemeCustomScrollbar(action.payload, workspace)
    case "add_theme_custom_size":
      return addThemeCustomSize(action.payload, workspace)
    case "add_theme_custom_dimension":
      return addThemeCustomDimension(action.payload, workspace)
    case "add_theme_custom_margin":
      return addThemeCustomMargin(action.payload, workspace)
    case "add_theme_custom_padding":
      return addThemeCustomPadding(action.payload, workspace)
    case "add_theme_custom_gap":
      return addThemeCustomGap(action.payload, workspace)
    case "add_theme_custom_corners":
      return addThemeCustomCorners(action.payload, workspace)
    case "add_theme_custom_borderWidth":
      return addThemeCustomBorderWidth(action.payload, workspace)
    case "add_theme_custom_blur":
      return addThemeCustomBlur(action.payload, workspace)
    case "add_theme_custom_spread":
      return addThemeCustomSpread(action.payload, workspace)
    case "add_theme_custom_fontSize":
      return addThemeCustomFontSize(action.payload, workspace)
    case "add_theme_custom_fontWeight":
      return addThemeCustomFontWeight(action.payload, workspace)
    case "add_theme_custom_lineHeight":
      return addThemeCustomLineHeight(action.payload, workspace)
    case "remove_theme_custom_swatch":
      return removeThemeCustomSwatch(action.payload, workspace)
    case "remove_theme_custom_font":
      return removeThemeCustomFont(action.payload, workspace)
    case "remove_theme_custom_border":
      return removeThemeCustomBorder(action.payload, workspace)
    case "remove_theme_custom_background":
      return removeThemeCustomBackground(action.payload, workspace)
    case "remove_theme_custom_gradient":
      return removeThemeCustomGradient(action.payload, workspace)
    case "remove_theme_custom_shadow":
      return removeThemeCustomShadow(action.payload, workspace)
    case "remove_theme_custom_scrollbar":
      return removeThemeCustomScrollbar(action.payload, workspace)
    case "remove_theme_custom_size":
      return removeThemeCustomSize(action.payload, workspace)
    case "remove_theme_custom_dimension":
      return removeThemeCustomDimension(action.payload, workspace)
    case "remove_theme_custom_margin":
      return removeThemeCustomMargin(action.payload, workspace)
    case "remove_theme_custom_padding":
      return removeThemeCustomPadding(action.payload, workspace)
    case "remove_theme_custom_gap":
      return removeThemeCustomGap(action.payload, workspace)
    case "remove_theme_custom_corners":
      return removeThemeCustomCorners(action.payload, workspace)
    case "remove_theme_custom_borderWidth":
      return removeThemeCustomBorderWidth(action.payload, workspace)
    case "remove_theme_custom_blur":
      return removeThemeCustomBlur(action.payload, workspace)
    case "remove_theme_custom_spread":
      return removeThemeCustomSpread(action.payload, workspace)
    case "remove_theme_custom_fontSize":
      return removeThemeCustomFontSize(action.payload, workspace)
    case "remove_theme_custom_fontWeight":
      return removeThemeCustomFontWeight(action.payload, workspace)
    case "remove_theme_custom_lineHeight":
      return removeThemeCustomLineHeight(action.payload, workspace)
    case "delete_theme":
      return deleteTheme(action.payload, workspace)
    case "duplicate_theme":
      return duplicateTheme(action.payload, workspace)

    case "set_font_collection_label":
      return setFontCollectionLabel(action.payload, workspace)
    case "set_font_collection_editor_data":
      return setFontCollectionEditorData(action.payload, workspace)
    case "set_font_collection_override":
      return setFontCollectionOverride(action.payload, workspace)
    case "set_font_collection_family_variant":
      return setFontCollectionFamilyVariant(action.payload, workspace)
    case "set_font_collection_family_preset":
      return setFontCollectionFamilyPreset(action.payload, workspace)
    case "reset_font_collection_label":
      return resetFontCollectionLabel(action.payload, workspace)
    case "reset_font_collection_editor_data":
      return resetFontCollectionEditorData(action.payload, workspace)
    case "reset_font_collection_override":
      return resetFontCollectionOverride(action.payload, workspace)
    case "delete_font_collection":
      return deleteFontCollection(action.payload, workspace)
    case "duplicate_font_collection":
      return duplicateFontCollection(action.payload, workspace)
    case "add_font_collection_custom_family":
      return addFontCollectionCustomFamily(action.payload, workspace)
    case "remove_font_collection_custom_family":
      return removeFontCollectionCustomFamily(action.payload, workspace)

    case "set_icon_set_label":
      return setIconSetLabel(action.payload, workspace)
    case "set_icon_set_override":
      return setIconSetOverride(action.payload, workspace)
    case "reset_icon_set_override":
      return resetIconSetOverride(action.payload, workspace)
    case "set_icon_set_subcategory_preset":
      return setIconSetSubcategoryPreset(action.payload, workspace)
    case "delete_icon_set":
      return deleteIconSet(action.payload, workspace)
    case "duplicate_icon_set":
      return duplicateIconSet(action.payload, workspace)

    case "stubs_add_font_collection_row":
    case "stubs_remove_font_collection_row":
    case "stubs_set_font_collection_field":
    case "stubs_duplicate_font_collection_row":
    case "stubs_add_media_row":
    case "stubs_remove_media_row":
    case "stubs_set_media_field":
    case "stubs_duplicate_media_row":
      return stubsResourceMapNoop(workspace)

    case "transcript_add_message":
      return workspace
  }
}

let preReducerMiddlewares = [validationMiddleware]

const postReducerMiddlewares = [
  migrationMiddleware,
  workspaceVerificationMiddleware,
]

if (process.env.NODE_ENV === "development") {
  preReducerMiddlewares.push(debugMiddleware)
}

export const workspaceReducer = applyMiddleware<WorkspaceAction>(
  reducer,
  ...preReducerMiddlewares,
  ...postReducerMiddlewares.reverse(),
)
