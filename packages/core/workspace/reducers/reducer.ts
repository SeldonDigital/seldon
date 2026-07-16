import { applyMiddleware } from "../middleware/compose/apply-middleware"
import { migrationMiddleware } from "../middleware/migration/middleware"
import { debugMiddleware } from "../middleware/observability/debug.middleware"
import { validationMiddleware } from "../middleware/validation/validation.middleware"
import { workspaceVerificationMiddleware } from "../middleware/verification/verification.middleware"
import type { Workspace } from "../model/workspace"
import type {
  ThemeCustomTokenSection,
  VariantId,
  WorkspaceAction,
} from "../types"
import { addAuthoredComponent } from "./handlers/add/add-authored-component"
import { addComponent } from "./handlers/add/add-component"
import { addCustomState } from "./handlers/add/add-custom-state"
import { addFontCollection } from "./handlers/add/add-font-collection"
import { addFontCollectionCustomFamily } from "./handlers/add/add-font-collection-custom-family"
import { addIconSet } from "./handlers/add/add-icon-set"
import { addMedia } from "./handlers/add/add-media"
import { addNodeLayer } from "./handlers/add/add-node-layer"
import { addPlayground } from "./handlers/add/add-playground"
import { addSandbox } from "./handlers/add/add-sandbox"
import { addTheme } from "./handlers/add/add-theme"
import { addThemeCustomToken } from "./handlers/add/add-theme-custom-token"
import { addVariant } from "./handlers/add/add-variant"
import { duplicateComponent } from "./handlers/duplicate/duplicate-component"
import { duplicateFontCollection } from "./handlers/duplicate/duplicate-font-collection"
import { duplicateIconSet } from "./handlers/duplicate/duplicate-icon-set"
import { duplicateNode } from "./handlers/duplicate/duplicate-node"
import { duplicatePlayground } from "./handlers/duplicate/duplicate-playground"
import { duplicateTheme } from "./handlers/duplicate/duplicate-theme"
import { insertDefaultInstance } from "./handlers/insert/insert-default-instance"
import { insertDuplicateInstance } from "./handlers/insert/insert-duplicate-instance"
import { insertVariantInstance } from "./handlers/insert/insert-variant-instance"
import { moveInstance } from "./handlers/move/move-instance"
import { moveInstanceDirectional } from "./handlers/move/move-instance-directional"
import { normalizeMetadataVersion } from "./handlers/normalize/normalize-metadata-version"
import { deleteFontCollection } from "./handlers/remove/delete-font-collection"
import { deleteIconSet } from "./handlers/remove/delete-icon-set"
import { deleteTheme } from "./handlers/remove/delete-theme"
import { removeBoard } from "./handlers/remove/remove-board"
import { removeCustomState } from "./handlers/remove/remove-custom-state"
import { removeFontCollectionCustomFamily } from "./handlers/remove/remove-font-collection-custom-family"
import { removeInstance } from "./handlers/remove/remove-instance"
import { removeNodeLayer } from "./handlers/remove/remove-node-layer"
import { removeThemeCustomSwatch } from "./handlers/remove/remove-theme-custom-swatch"
import { removeThemeCustomToken } from "./handlers/remove/remove-theme-custom-token"
import { removeVariant } from "./handlers/remove/remove-variant"
import { reorderBoard } from "./handlers/reorder/reorder-board"
import { reorderInstanceInParent } from "./handlers/reorder/reorder-instance-in-parent"
import { reorderNodeLayer } from "./handlers/reorder/reorder-node-layer"
import { reorderVariantInBoard } from "./handlers/reorder/reorder-variant-in-board"
import { resetBoardAuthor } from "./handlers/reset/reset-board-author"
import { resetBoardCredentials } from "./handlers/reset/reset-board-credentials"
import { resetBoardEditorData } from "./handlers/reset/reset-board-editor-data"
import { resetBoardIntent } from "./handlers/reset/reset-board-intent"
import { resetBoardLabel } from "./handlers/reset/reset-board-label"
import { resetBoardLicense } from "./handlers/reset/reset-board-license"
import { resetBoardPreview } from "./handlers/reset/reset-board-preview"
import { resetBoardTags } from "./handlers/reset/reset-board-tags"
import { resetComponentBoard } from "./handlers/reset/reset-component-board"
import { resetComponentProperty } from "./handlers/reset/reset-component-property"
import { resetComponentToCatalog } from "./handlers/reset/reset-component-to-catalog"
import { resetDefaultVariantToCatalog } from "./handlers/reset/reset-default-variant-to-catalog"
import { resetFontCollection } from "./handlers/reset/reset-font-collection"
import { resetFontCollectionEditorData } from "./handlers/reset/reset-font-collection-editor-data"
import { resetFontCollectionLabel } from "./handlers/reset/reset-font-collection-label"
import { resetFontCollectionOverride } from "./handlers/reset/reset-font-collection-override"
import { resetIconSet } from "./handlers/reset/reset-icon-set"
import { resetIconSetOverride } from "./handlers/reset/reset-icon-set-override"
import { resetInstanceToOriginal } from "./handlers/reset/reset-instance-to-original"
import { resetInstanceToSource } from "./handlers/reset/reset-instance-to-source"
import { resetNode } from "./handlers/reset/reset-node"
import { resetNodeEditorData } from "./handlers/reset/reset-node-editor-data"
import { resetNodeLabel } from "./handlers/reset/reset-node-label"
import { resetNodeProperty } from "./handlers/reset/reset-node-property"
import { resetNodeState } from "./handlers/reset/reset-node-state"
import { resetNodeStateProperty } from "./handlers/reset/reset-node-state-property"
import { resetThemeEditorData } from "./handlers/reset/reset-theme-editor-data"
import { resetThemeLabel } from "./handlers/reset/reset-theme-label"
import { resetThemeOverride } from "./handlers/reset/reset-theme-override"
import { resetThemeTokens } from "./handlers/reset/reset-theme-tokens"
import { resetVariantInstances } from "./handlers/reset/reset-variant-instances"
import { resetVariantToCatalog } from "./handlers/reset/reset-variant-to-catalog"
import { resetWorkspaceIntent } from "./handlers/reset/reset-workspace-intent"
import { resetWorkspaceLabel } from "./handlers/reset/reset-workspace-label"
import { resetWorkspaceLastUpdate } from "./handlers/reset/reset-workspace-last-update"
import { resetWorkspaceLicense } from "./handlers/reset/reset-workspace-license"
import { resetWorkspaceOwner } from "./handlers/reset/reset-workspace-owner"
import { resetWorkspaceTags } from "./handlers/reset/reset-workspace-tags"
import { applyComponentPropertiesToAllBoards } from "./handlers/set/apply-component-properties-to-all-boards"
import { renameCustomState } from "./handlers/set/rename-custom-state"
import { setBoardAuthor } from "./handlers/set/set-board-author"
import { setBoardCredentials } from "./handlers/set/set-board-credentials"
import { setBoardEditorData } from "./handlers/set/set-board-editor-data"
import { setBoardIntent } from "./handlers/set/set-board-intent"
import { setBoardLabel } from "./handlers/set/set-board-label"
import { setBoardLicense } from "./handlers/set/set-board-license"
import { setBoardPreview } from "./handlers/set/set-board-preview"
import { setBoardTags } from "./handlers/set/set-board-tags"
import { setComponentProperties } from "./handlers/set/set-component-properties"
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
import { setNodeLayerKind } from "./handlers/set/set-node-layer-kind"
import { setNodeProperties } from "./handlers/set/set-node-properties"
import { setNodeRef } from "./handlers/set/set-node-ref"
import { setNodeRepeat } from "./handlers/set/set-node-repeat"
import { setNodeStateProperties } from "./handlers/set/set-node-state-properties"
import { setNodeTheme } from "./handlers/set/set-node-theme"
import { setPlaygroundLabel } from "./handlers/set/set-playground-label"
import { setThemeCustomTokenName } from "./handlers/set/set-theme-custom-token-name"
import { setThemeEditorData } from "./handlers/set/set-theme-editor-data"
import { setThemeLabel } from "./handlers/set/set-theme-label"
import { setThemeOverride } from "./handlers/set/set-theme-override"
import { setThemeScaleSlot } from "./handlers/set/set-theme-scale-slot"
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
    case "add_authored_component":
      return addAuthoredComponent(action.payload, workspace)
    case "add_sandbox":
      return addSandbox(action.payload, workspace)
    case "add_component_and_insert_default_instance": {
      const { boardKey, target, variantFallbacks } = action.payload
      const workspaceWithBoard = addComponent(
        { boardKey, variantFallbacks },
        workspace,
      )
      const board = workspaceWithBoard.boards[boardKey]
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

    case "remove_board":
      return removeBoard(action.payload, workspace)
    case "duplicate_component":
      return duplicateComponent(action.payload, workspace)
    case "duplicate_playground":
      return duplicatePlayground(action.payload, workspace)
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
    case "reset_component_board":
      return resetComponentBoard(action.payload, workspace)
    case "apply_component_properties_to_all_boards":
      return applyComponentPropertiesToAllBoards(action.payload, workspace)
    case "set_board_label":
      return setBoardLabel(action.payload, workspace)
    case "set_playground_label":
      return setPlaygroundLabel(action.payload, workspace)
    case "set_board_intent":
      return setBoardIntent(action.payload, workspace)
    case "set_board_tags":
      return setBoardTags(action.payload, workspace)
    case "set_board_license":
      return setBoardLicense(action.payload, workspace)
    case "set_board_author":
      return setBoardAuthor(action.payload, workspace)
    case "set_board_credentials":
      return setBoardCredentials(action.payload, workspace)
    case "set_board_preview":
      return setBoardPreview(action.payload, workspace)
    case "set_board_editor_data":
      return setBoardEditorData(action.payload, workspace)

    case "reset_board_label":
      return resetBoardLabel(action.payload, workspace)
    case "reset_board_intent":
      return resetBoardIntent(action.payload, workspace)
    case "reset_board_tags":
      return resetBoardTags(action.payload, workspace)
    case "reset_board_license":
      return resetBoardLicense(action.payload, workspace)
    case "reset_board_author":
      return resetBoardAuthor(action.payload, workspace)
    case "reset_board_credentials":
      return resetBoardCredentials(action.payload, workspace)
    case "reset_board_preview":
      return resetBoardPreview(action.payload, workspace)
    case "reset_board_editor_data":
      return resetBoardEditorData(action.payload, workspace)

    case "add_variant":
      return addVariant(action.payload, workspace)

    case "set_node_properties":
      return setNodeProperties(action.payload, workspace)
    case "reset_node_property":
      return resetNodeProperty(action.payload, workspace)
    case "reset_node":
      return resetNode(action.payload, workspace)
    case "set_node_state_properties":
      return setNodeStateProperties(action.payload, workspace)
    case "reset_node_state_property":
      return resetNodeStateProperty(action.payload, workspace)
    case "reset_node_state":
      return resetNodeState(action.payload, workspace)
    case "add_custom_state":
      return addCustomState(action.payload, workspace)
    case "remove_custom_state":
      return removeCustomState(action.payload, workspace)
    case "rename_custom_state":
      return renameCustomState(action.payload, workspace)
    case "add_node_layer":
      return addNodeLayer(action.payload, workspace)
    case "remove_node_layer":
      return removeNodeLayer(action.payload, workspace)
    case "reorder_node_layer":
      return reorderNodeLayer(action.payload, workspace)
    case "set_node_layer_kind":
      return setNodeLayerKind(action.payload, workspace)
    case "set_node_label":
      return setNodeLabel(action.payload, workspace)
    case "set_node_ref":
      return setNodeRef(action.payload, workspace)
    case "set_node_theme":
      return setNodeTheme(action.payload, workspace)
    case "set_node_editor_data":
      return setNodeEditorData(action.payload, workspace)
    case "set_node_repeat":
      return setNodeRepeat(action.payload, workspace)
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
    case "set_theme_scale_slot":
      return setThemeScaleSlot(action.payload, workspace)
    case "set_theme_custom_token_name":
      return setThemeCustomTokenName(action.payload, workspace)
    case "remove_instance":
      return removeInstance(action.payload, workspace)
    case "remove_variant":
      return removeVariant(action.payload, workspace)
    case "duplicate_node":
      return duplicateNode(action.payload, workspace)
    case "reset_variant_to_catalog":
      return resetVariantToCatalog(action.payload, workspace)
    case "reset_variant_instances":
      return resetVariantInstances(action.payload, workspace)
    case "reset_instance_to_source":
      return resetInstanceToSource(action.payload, workspace)
    case "reset_instance_to_original":
      return resetInstanceToOriginal(action.payload, workspace)
    case "reset_default_variant_to_catalog":
      return resetDefaultVariantToCatalog(action.payload, workspace)
    case "reset_component_to_catalog":
      return resetComponentToCatalog(action.payload, workspace)
    case "move_instance":
      return moveInstance(action.payload, workspace)
    case "move_instance_directional":
      return moveInstanceDirectional(action.payload, workspace)
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
    case "add_theme_custom_font":
    case "add_theme_custom_border":
    case "add_theme_custom_gradient":
    case "add_theme_custom_shadow":
    case "add_theme_custom_scrollbar":
    case "add_theme_custom_size":
    case "add_theme_custom_dimension":
    case "add_theme_custom_margin":
    case "add_theme_custom_padding":
    case "add_theme_custom_gap":
    case "add_theme_custom_corners":
    case "add_theme_custom_borderWidth":
    case "add_theme_custom_blur":
    case "add_theme_custom_spread":
    case "add_theme_custom_fontSize":
    case "add_theme_custom_fontWeight":
    case "add_theme_custom_lineHeight":
      return addThemeCustomToken(
        action.type.slice(
          "add_theme_custom_".length,
        ) as ThemeCustomTokenSection,
        action.payload,
        workspace,
      )
    case "remove_theme_custom_swatch":
      return removeThemeCustomSwatch(action.payload, workspace)
    case "remove_theme_custom_font":
    case "remove_theme_custom_border":
    case "remove_theme_custom_gradient":
    case "remove_theme_custom_shadow":
    case "remove_theme_custom_scrollbar":
    case "remove_theme_custom_size":
    case "remove_theme_custom_dimension":
    case "remove_theme_custom_margin":
    case "remove_theme_custom_padding":
    case "remove_theme_custom_gap":
    case "remove_theme_custom_corners":
    case "remove_theme_custom_borderWidth":
    case "remove_theme_custom_blur":
    case "remove_theme_custom_spread":
    case "remove_theme_custom_fontSize":
    case "remove_theme_custom_fontWeight":
    case "remove_theme_custom_lineHeight":
      return removeThemeCustomToken(
        action.type.slice("remove_theme_custom_".length) as Exclude<
          ThemeCustomTokenSection,
          "swatch"
        >,
        action.payload,
        workspace,
      )
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
    case "reset_font_collection":
      return resetFontCollection(action.payload, workspace)
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
    case "reset_icon_set":
      return resetIconSet(action.payload, workspace)
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
  }
}

const preReducerMiddlewares = [validationMiddleware]

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
