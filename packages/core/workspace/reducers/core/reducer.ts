import { applyMiddleware } from "../../middleware/apply-middleware"
import { debugMiddleware } from "../../middleware/debug"
import { migrationMiddleware } from "../../middleware/migration/middleware"
import { validationMiddleware } from "../../middleware/validation"
import { workspaceVerificationMiddleware } from "../../middleware/verification"
import { Workspace } from "../../types"
import { handleAddBoard } from "./handlers/handle-add-board"
import { handleAddCustomThemeSwatch } from "./handlers/handle-add-custom-theme-swatch"
import { handleAddVariant } from "./handlers/handle-add-variant"
import { handleDuplicateNode } from "./handlers/handle-duplicate-node"
import { handleInsertNode } from "./handlers/handle-insert-node"
import { handleMoveNode } from "./handlers/handle-move-node"
import { handleRemoveBoard } from "./handlers/handle-remove-board"
import { handleRemoveCustomThemeSwatch } from "./handlers/handle-remove-custom-theme-swatch"
import { handleRemoveNode } from "./handlers/handle-remove-node"
import { handleReorderBoard } from "./handlers/handle-reorder-board"
import { handleReorderNode } from "./handlers/handle-reorder-node"
import { handleResetBoardProperty } from "./handlers/handle-reset-board-properties"
import { handleResetCustomTheme } from "./handlers/handle-reset-custom-theme"
import { handleResetNodeProperty } from "./handlers/handle-reset-node-property"
import { handleSetBoardProperties } from "./handlers/handle-set-board-properties"
import { handleSetBoardTheme } from "./handlers/handle-set-board-theme"
import { handleSetCustomThemeBackgroundValue } from "./handlers/handle-set-custom-theme-background-value"
import { handleSetCustomThemeBaseColor } from "./handlers/handle-set-custom-theme-base-color"
import { handleSetCustomThemeBlurValue } from "./handlers/handle-set-custom-theme-blur-value"
import { handleSetCustomThemeBorderValue } from "./handlers/handle-set-custom-theme-border-value"
import { handleSetCustomThemeBorderWidthValue } from "./handlers/handle-set-custom-theme-border-width-value"
import { handleSetCustomThemeColorValue } from "./handlers/handle-set-custom-theme-color-value"
import { handleSetCustomThemeCoreFontSize } from "./handlers/handle-set-custom-theme-core-font-size"
import { handleSetCustomThemeCoreRatio } from "./handlers/handle-set-custom-theme-core-ratio"
import { handleSetCustomThemeCoreSize } from "./handlers/handle-set-custom-theme-core-size"
import { handleSetCustomThemeCornersValue } from "./handlers/handle-set-custom-theme-corners-value"
import { handleSetCustomThemeDefaultIconColor } from "./handlers/handle-set-custom-theme-default-icon-color"
import { handleSetCustomThemeDefaultIconSize } from "./handlers/handle-set-custom-theme-default-icon-size"
import { handleSetCustomThemeDimensionValue } from "./handlers/handle-set-custom-theme-dimension-value"
import { handleSetCustomThemeFontFamilyValue } from "./handlers/handle-set-custom-theme-font-family-value"
import { handleSetCustomThemeFontSizeValue } from "./handlers/handle-set-custom-theme-font-size-value"
import { handleSetCustomThemeFontValue } from "./handlers/handle-set-custom-theme-font-value"
import { handleSetCustomThemeFontWeightValue } from "./handlers/handle-set-custom-theme-font-weight-value"
import { handleSetCustomThemeGapValue } from "./handlers/handle-set-custom-theme-gap-value"
import { handleSetCustomThemeGradientValue } from "./handlers/handle-set-custom-theme-gradient-value"
import { handleSetCustomThemeHarmony } from "./handlers/handle-set-custom-theme-harmony"
import { handleSetCustomThemeLineHeightValue } from "./handlers/handle-set-custom-theme-line-height-value"
import { handleSetCustomThemeMarginValue } from "./handlers/handle-set-custom-theme-margin-value"
import { handleSetCustomThemePaddingValue } from "./handlers/handle-set-custom-theme-padding-value"
import { handleSetCustomThemeScrollbarValue } from "./handlers/handle-set-custom-theme-scrollbar-value"
import { handleSetCustomThemeShadowValue } from "./handlers/handle-set-custom-theme-shadow-value"
import { handleSetCustomThemeSizeValue } from "./handlers/handle-set-custom-theme-size-value"
import { handleSetCustomThemeSpreadValue } from "./handlers/handle-set-custom-theme-spread-value"
import { handleSetNodeLabel } from "./handlers/handle-set-node-label"
import { handleSetNodeProperties } from "./handlers/handle-set-node-properties"
import { handleSetNodeTheme } from "./handlers/handle-set-node-theme"
import { handleSetWorkspace } from "./handlers/handle-set-workspace"
import { handleUpdateCustomThemeSwatch } from "./handlers/handle-update-custom-theme-swatch"
import { CoreAction } from "./types"

// Base reducer implementation
function reducer(workspace: Workspace, action: CoreAction): Workspace {
  switch (action.type) {
    // Workspace actions
    case "set_workspace":
      return handleSetWorkspace(action.payload)

    // Board actions
    case "add_board":
      return handleAddBoard(action.payload, workspace)
    case "add_board_and_insert_default_variant": {
      const workspaceWithBoard = handleAddBoard(action.payload, workspace)
      return handleInsertNode(
        {
          nodeId: `variant-${action.payload.componentId}-default`,
          target: {
            parentId: action.payload.target.parentId,
            index: action.payload.target.index,
          },
        },
        workspaceWithBoard,
      )
    }

    case "remove_board":
      return handleRemoveBoard(action.payload, workspace)
    case "reorder_board":
      return handleReorderBoard(action.payload, workspace)
    case "set_board_theme":
      return handleSetBoardTheme(action.payload, workspace)
    case "set_board_properties":
      return handleSetBoardProperties(action.payload, workspace)
    case "reset_board_property":
      return handleResetBoardProperty(action.payload, workspace)

    // Variant actions
    case "add_variant":
      return handleAddVariant(action.payload, workspace)

    // Node actions
    case "set_node_properties":
      return handleSetNodeProperties(action.payload, workspace)
    case "reset_node_property":
      return handleResetNodeProperty(action.payload, workspace)
    case "set_node_label":
      return handleSetNodeLabel(action.payload, workspace)
    case "set_node_theme":
      return handleSetNodeTheme(action.payload, workspace)
    case "remove_node":
      return handleRemoveNode(action.payload, workspace)
    case "duplicate_node":
      return handleDuplicateNode(action.payload, workspace)
    case "move_node":
      return handleMoveNode(action.payload, workspace)
    case "reorder_node":
      return handleReorderNode(action.payload, workspace)
    case "insert_node":
      return handleInsertNode(action.payload, workspace)

    // Custom theme actions
    case "reset_custom_theme":
      return handleResetCustomTheme(action.payload, workspace)

    // Core theme section actions
    case "set_custom_theme_core_ratio":
      return handleSetCustomThemeCoreRatio(action.payload, workspace)
    case "set_custom_theme_core_font_size":
      return handleSetCustomThemeCoreFontSize(action.payload, workspace)
    case "set_custom_theme_core_size":
      return handleSetCustomThemeCoreSize(action.payload, workspace)
    case "set_custom_theme_base_color":
      return handleSetCustomThemeBaseColor(action.payload, workspace)
    case "set_custom_theme_harmony":
      return handleSetCustomThemeHarmony(action.payload, workspace)
    case "set_custom_theme_color_value":
      return handleSetCustomThemeColorValue(action.payload, workspace)
    case "set_custom_theme_default_icon_color":
      return handleSetCustomThemeDefaultIconColor(action.payload, workspace)
    case "set_custom_theme_default_icon_size":
      return handleSetCustomThemeDefaultIconSize(action.payload, workspace)

    // Other theme section actions
    case "set_custom_theme_border_width_value":
      return handleSetCustomThemeBorderWidthValue(action.payload, workspace)
    case "set_custom_theme_corners_value":
      return handleSetCustomThemeCornersValue(action.payload, workspace)
    case "set_custom_theme_font_family_value":
      return handleSetCustomThemeFontFamilyValue(action.payload, workspace)
    case "set_custom_theme_font_value":
      return handleSetCustomThemeFontValue(action.payload, workspace)
    case "set_custom_theme_font_size_value":
      return handleSetCustomThemeFontSizeValue(action.payload, workspace)
    case "set_custom_theme_font_weight_value":
      return handleSetCustomThemeFontWeightValue(action.payload, workspace)
    case "set_custom_theme_size_value":
      return handleSetCustomThemeSizeValue(action.payload, workspace)
    case "set_custom_theme_dimension_value":
      return handleSetCustomThemeDimensionValue(action.payload, workspace)
    case "set_custom_theme_margin_value":
      return handleSetCustomThemeMarginValue(action.payload, workspace)
    case "set_custom_theme_padding_value":
      return handleSetCustomThemePaddingValue(action.payload, workspace)
    case "set_custom_theme_gap_value":
      return handleSetCustomThemeGapValue(action.payload, workspace)
    case "set_custom_theme_line_height_value":
      return handleSetCustomThemeLineHeightValue(action.payload, workspace)
    case "set_custom_theme_shadow_value":
      return handleSetCustomThemeShadowValue(action.payload, workspace)
    case "set_custom_theme_border_value":
      return handleSetCustomThemeBorderValue(action.payload, workspace)
    case "set_custom_theme_blur_value":
      return handleSetCustomThemeBlurValue(action.payload, workspace)
    case "set_custom_theme_spread_value":
      return handleSetCustomThemeSpreadValue(action.payload, workspace)
    case "set_custom_theme_gradient_value":
      return handleSetCustomThemeGradientValue(action.payload, workspace)
    case "set_custom_theme_background_value":
      return handleSetCustomThemeBackgroundValue(action.payload, workspace)
    case "set_custom_theme_scrollbar_value":
      return handleSetCustomThemeScrollbarValue(action.payload, workspace)

    case "add_custom_theme_swatch":
      return handleAddCustomThemeSwatch(action.payload, workspace)
    case "remove_custom_theme_swatch":
      return handleRemoveCustomThemeSwatch(action.payload, workspace)
    case "update_custom_theme_swatch":
      return handleUpdateCustomThemeSwatch(action.payload, workspace)

    default:
      return workspace
  }
}

let preReducerMiddlewares = [validationMiddleware]

const postReducerMiddlewares = [
  migrationMiddleware,
  workspaceVerificationMiddleware,
]

if (import.meta.env.DEV) {
  preReducerMiddlewares.push(debugMiddleware)
}

// Create the enhanced reducer with middleware
export const coreReducer = applyMiddleware<CoreAction>(
  reducer,
  ...preReducerMiddlewares,
  // Reverse the order of the post-reducer middlewares so that the verification middleware runs last
  ...postReducerMiddlewares.reverse(),
)
