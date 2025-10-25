import { applyMiddleware } from "../../middleware/apply-middleware"
import { debugMiddleware } from "../../middleware/debug"
import { migrationMiddleware } from "../../middleware/migration/middleware"
import { validationMiddleware } from "../../middleware/validation"
import { Workspace } from "../../types"
import { handleAiAddVariant } from "./handlers/divergent/handle-ai-add-variant"
import { handleAiAddComponent } from "./handlers/handle-ai-add-component"
import { handleAiAddCustomThemeSwatch } from "./handlers/handle-ai-add-custom-theme-swatch"
import { handleAiDuplicateNode } from "./handlers/handle-ai-duplicate-node"
import { handleAiInsertNode } from "./handlers/handle-ai-insert-node"
import { handleAiMoveNode } from "./handlers/handle-ai-move-node"
import { handleAiRemoveComponent } from "./handlers/handle-ai-remove-component"
import { handleAiRemoveCustomThemeSwatch } from "./handlers/handle-ai-remove-custom-theme-swatch"
import { handleAiRemoveNode } from "./handlers/handle-ai-remove-node"
import { handleAiReorderBoard } from "./handlers/handle-ai-reorder-board"
import { handleAiReorderNode } from "./handlers/handle-ai-reorder-node"
import { handleAiResetCustomTheme } from "./handlers/handle-ai-reset-custom-theme"
import { handleAiResetNodeProperty } from "./handlers/handle-ai-reset-node-property"
import { handleAiSetBoardProperties } from "./handlers/handle-ai-set-board-properties"
import { handleAiSetBoardTheme } from "./handlers/handle-ai-set-board-theme"
import { handleAiSetCustomThemeBackgroundValue } from "./handlers/handle-ai-set-custom-theme-background-value"
import { handleAiSetCustomThemeBaseColor } from "./handlers/handle-ai-set-custom-theme-base-color"
import { handleAiSetCustomThemeBlurValue } from "./handlers/handle-ai-set-custom-theme-blur-value"
import { handleAiSetCustomThemeBorderValue } from "./handlers/handle-ai-set-custom-theme-border-value"
import { handleAiSetCustomThemeBorderWidthValue } from "./handlers/handle-ai-set-custom-theme-border-width-value"
import { handleAiSetCustomThemeColorValue } from "./handlers/handle-ai-set-custom-theme-color-value"
import { handleAiSetCustomThemeCoreFontSize } from "./handlers/handle-ai-set-custom-theme-core-font-size"
import { handleAiSetCustomThemeCoreRatio } from "./handlers/handle-ai-set-custom-theme-core-ratio"
import { handleAiSetCustomThemeCoreSize } from "./handlers/handle-ai-set-custom-theme-core-size"
import { handleAiSetCustomThemeCornersValue } from "./handlers/handle-ai-set-custom-theme-corners-value"
import { handleAiSetCustomThemeDefaultIconColor } from "./handlers/handle-ai-set-custom-theme-default-icon-color"
import { handleAiSetCustomThemeDefaultIconSize } from "./handlers/handle-ai-set-custom-theme-default-icon-size"
import { handleAiSetCustomThemeDimensionValue } from "./handlers/handle-ai-set-custom-theme-dimension-value"
import { handleAiSetCustomThemeFontFamilyValue } from "./handlers/handle-ai-set-custom-theme-font-family-value"
import { handleAiSetCustomThemeFontSizeValue } from "./handlers/handle-ai-set-custom-theme-font-size-value"
import { handleAiSetCustomThemeFontValue } from "./handlers/handle-ai-set-custom-theme-font-value"
import { handleAiSetCustomThemeFontWeightValue } from "./handlers/handle-ai-set-custom-theme-font-weight-value"
import { handleAiSetCustomThemeGapValue } from "./handlers/handle-ai-set-custom-theme-gap-value"
import { handleAiSetCustomThemeGradientValue } from "./handlers/handle-ai-set-custom-theme-gradient-value"
import { handleAiSetCustomThemeHarmony } from "./handlers/handle-ai-set-custom-theme-harmony"
import { handleAiSetCustomThemeLineHeightValue } from "./handlers/handle-ai-set-custom-theme-line-height-value"
import { handleAiSetCustomThemeMarginValue } from "./handlers/handle-ai-set-custom-theme-margin-value"
import { handleAiSetCustomThemePaddingValue } from "./handlers/handle-ai-set-custom-theme-padding-value"
import { handleAiSetCustomThemeScrollbarValue } from "./handlers/handle-ai-set-custom-theme-scrollbar-value"
import { handleAiSetCustomThemeShadowValue } from "./handlers/handle-ai-set-custom-theme-shadow-value"
import { handleAiSetCustomThemeSizeValue } from "./handlers/handle-ai-set-custom-theme-size-value"
import { handleAiSetCustomThemeSpreadValue } from "./handlers/handle-ai-set-custom-theme-spread-value"
import { handleAiSetNodeLabel } from "./handlers/handle-ai-set-node-label"
import { handleAiSetNodeProperties } from "./handlers/handle-ai-set-node-properties"
import { handleAiSetNodeTheme } from "./handlers/handle-ai-set-node-theme"
import { handleAiUpdateCustomThemeSwatch } from "./handlers/handle-ai-update-custom-theme-swatch"
import { AIAction } from "./types"

function reducer(workspace: Workspace, action: AIAction): Workspace {
  const { type, payload } = action

  switch (type) {
    case "ai_add_component":
      return handleAiAddComponent(payload, workspace)

    case "ai_remove_component":
      return handleAiRemoveComponent(payload, workspace)

    case "ai_reorder_board":
      return handleAiReorderBoard(payload, workspace)

    case "ai_insert_node":
      return handleAiInsertNode(payload, workspace)

    case "ai_add_variant":
      return handleAiAddVariant(payload, workspace)

    case "ai_remove_node":
      return handleAiRemoveNode(payload, workspace)

    case "ai_move_node":
      return handleAiMoveNode(payload, workspace)

    case "ai_reorder_node":
      return handleAiReorderNode(payload, workspace)

    case "ai_duplicate_node":
      return handleAiDuplicateNode(payload, workspace)

    case "ai_set_node_properties":
      return handleAiSetNodeProperties(payload, workspace)

    case "ai_reset_node_property":
      return handleAiResetNodeProperty(payload, workspace)

    case "ai_set_node_label":
      return handleAiSetNodeLabel(payload, workspace)

    case "ai_set_node_theme":
      return handleAiSetNodeTheme(payload, workspace)

    case "ai_set_board_properties":
      return handleAiSetBoardProperties(payload, workspace)

    case "ai_set_board_theme":
      return handleAiSetBoardTheme(payload, workspace)

    case "ai_add_custom_theme_swatch":
      return handleAiAddCustomThemeSwatch(payload, workspace)

    case "ai_remove_custom_theme_swatch":
      return handleAiRemoveCustomThemeSwatch(payload, workspace)

    case "ai_update_custom_theme_swatch":
      return handleAiUpdateCustomThemeSwatch(payload, workspace)

    case "ai_transcript_add_message":
      return workspace

    // Custom theme
    case "ai_reset_custom_theme":
      return handleAiResetCustomTheme(payload, workspace)

    case "ai_set_custom_theme_core_ratio":
      return handleAiSetCustomThemeCoreRatio(payload, workspace)

    case "ai_set_custom_theme_core_font_size":
      return handleAiSetCustomThemeCoreFontSize(payload, workspace)

    case "ai_set_custom_theme_core_size":
      return handleAiSetCustomThemeCoreSize(payload, workspace)

    case "ai_set_custom_theme_font_family_value":
      return handleAiSetCustomThemeFontFamilyValue(payload, workspace)

    case "ai_set_custom_theme_base_color":
      return handleAiSetCustomThemeBaseColor(payload, workspace)

    case "ai_set_custom_theme_harmony":
      return handleAiSetCustomThemeHarmony(payload, workspace)

    case "ai_set_custom_theme_color_value":
      return handleAiSetCustomThemeColorValue(payload, workspace)

    case "ai_set_custom_theme_default_icon_color":
      return handleAiSetCustomThemeDefaultIconColor(payload, workspace)

    case "ai_set_custom_theme_default_icon_size":
      return handleAiSetCustomThemeDefaultIconSize(payload, workspace)

    case "ai_set_custom_theme_border_width_value":
      return handleAiSetCustomThemeBorderWidthValue(payload, workspace)

    case "ai_set_custom_theme_corners_value":
      return handleAiSetCustomThemeCornersValue(payload, workspace)

    case "ai_set_custom_theme_font_value":
      return handleAiSetCustomThemeFontValue(payload, workspace)

    case "ai_set_custom_theme_font_size_value":
      return handleAiSetCustomThemeFontSizeValue(payload, workspace)

    case "ai_set_custom_theme_font_weight_value":
      return handleAiSetCustomThemeFontWeightValue(payload, workspace)

    case "ai_set_custom_theme_size_value":
      return handleAiSetCustomThemeSizeValue(payload, workspace)

    case "ai_set_custom_theme_dimension_value":
      return handleAiSetCustomThemeDimensionValue(payload, workspace)

    case "ai_set_custom_theme_margin_value":
      return handleAiSetCustomThemeMarginValue(payload, workspace)

    case "ai_set_custom_theme_padding_value":
      return handleAiSetCustomThemePaddingValue(payload, workspace)

    case "ai_set_custom_theme_gap_value":
      return handleAiSetCustomThemeGapValue(payload, workspace)

    case "ai_set_custom_theme_line_height_value":
      return handleAiSetCustomThemeLineHeightValue(payload, workspace)

    case "ai_set_custom_theme_shadow_value":
      return handleAiSetCustomThemeShadowValue(payload, workspace)

    case "ai_set_custom_theme_border_value":
      return handleAiSetCustomThemeBorderValue(payload, workspace)

    case "ai_set_custom_theme_blur_value":
      return handleAiSetCustomThemeBlurValue(payload, workspace)

    case "ai_set_custom_theme_spread_value":
      return handleAiSetCustomThemeSpreadValue(payload, workspace)

    case "ai_set_custom_theme_gradient_value":
      return handleAiSetCustomThemeGradientValue(payload, workspace)

    case "ai_set_custom_theme_background_value":
      return handleAiSetCustomThemeBackgroundValue(payload, workspace)

    case "ai_set_custom_theme_scrollbar_value":
      return handleAiSetCustomThemeScrollbarValue(payload, workspace)

    default:
      return workspace
  }
}

let preReducerMiddlewares = [validationMiddleware]

const postReducerMiddlewares = [migrationMiddleware]
if (import.meta.env.DEV) {
  preReducerMiddlewares.push(debugMiddleware)
}

// Create the enhanced reducer with middleware
export const aiReducer = applyMiddleware<AIAction>(
  reducer,
  ...preReducerMiddlewares,
  // Reverse the order of the post-reducer middlewares so that the verification middleware runs last
  ...postReducerMiddlewares.reverse(),
)
