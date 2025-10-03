import { ComponentId } from "../../../components/constants"
import {
  HSL,
  Properties,
  PropertyKey,
  SubPropertyKey,
} from "../../../properties"
import {
  ColorThemeValue,
  HSLValue,
  HexValue,
  RGBValue,
  SizeValue,
} from "../../../properties/values"
import {
  BackgroundParameters,
  BorderParameters,
  FontParameters,
  GradientParameters,
  ModulationParameters,
  ScrollbarParameters,
  ShadowParameters,
  ThemeBackgroundId,
  ThemeBorderId,
  ThemeBorderWidthId,
  ThemeCornersId,
  ThemeCustomSwatchId,
  ThemeDimensionId,
  ThemeFontFamilyId,
  ThemeFontId,
  ThemeFontSizeId,
  ThemeFontWeightId,
  ThemeGradientId,
  ThemeId,
  ThemeLineHeightId,
  ThemeScrollbarId,
  ThemeShadowId,
  ThemeSizeId,
  ThemeSpacingId,
} from "../../../themes/types"
import { Harmony, Ratio } from "../../../themes/types"
import { InstanceId, ReferenceId, VariantId } from "../../types"

// Component Actions
export interface AddComponentAction {
  type: "ai_add_component"
  payload: {
    componentId: ComponentId
    ref: ReferenceId
  }
}

export interface RemoveComponentAction {
  type: "ai_remove_component"
  payload: {
    componentId: ComponentId
  }
}

export interface ReorderBoardAction {
  type: "ai_reorder_board"
  payload: {
    componentId: ComponentId
    newIndex: number
  }
}

export interface AddVariantAction {
  type: "ai_add_variant"
  payload: {
    componentId: ComponentId
    ref: ReferenceId
  }
}

// Node Actions
export interface InsertNodeAction {
  type: "ai_insert_node"
  payload: {
    nodeId: VariantId | InstanceId | ReferenceId
    ref: ReferenceId
    // If target is set, we insert it into that node, otherwise we duplicate in place
    target: {
      parentId: VariantId | InstanceId | ReferenceId
      index?: number
    }
  }
}

export interface DuplicateNodeAction {
  type: "ai_duplicate_node"
  payload: {
    nodeId: VariantId | InstanceId
    ref: ReferenceId
  }
}

export interface RemoveNodeAction {
  type: "ai_remove_node"
  payload: {
    nodeId: VariantId | InstanceId | ReferenceId
  }
}

export interface MoveNodeAction {
  type: "ai_move_node"
  payload: {
    nodeId: VariantId | InstanceId | ReferenceId
    target: {
      parentId: VariantId | InstanceId | ReferenceId
      index?: number
    }
  }
}

export interface ReorderNodeAction {
  type: "ai_reorder_node"
  payload: {
    nodeId: VariantId | InstanceId | ReferenceId
    newIndex: number
  }
}

export interface SetNodePropertiesAction {
  type: "ai_set_node_properties"
  payload: {
    nodeId: VariantId | InstanceId | ReferenceId
    properties: Properties
  }
}

export interface SetNodeLabelAction {
  type: "ai_set_node_label"
  payload: {
    nodeId: VariantId | InstanceId | ReferenceId
    label: string
  }
}

export interface SetNodeThemeAction {
  type: "ai_set_node_theme"
  payload: {
    nodeId: VariantId | InstanceId | ReferenceId
    theme: ThemeId | null
  }
}

export interface ResetNodePropertyAction {
  type: "ai_reset_node_property"
  payload: {
    nodeId: VariantId | InstanceId | ReferenceId
    propertyKey: PropertyKey
    subpropertyKey?: SubPropertyKey
  }
}

// Board Actions
export interface SetBoardPropertiesAction {
  type: "ai_set_board_properties"
  payload: {
    componentId: ComponentId
    properties: Properties
  }
}

export interface SetBoardThemeAction {
  type: "ai_set_board_theme"
  payload: {
    componentId: ComponentId
    theme: ThemeId
  }
}

// Custom Theme Actions
export interface ResetCustomThemeAction {
  type: "ai_reset_custom_theme"
  payload: {}
}

export interface AddCustomThemeSwatchAction {
  type: "ai_add_custom_theme_swatch"
  payload: {
    name: string
    intent: string
    value: HSL
  }
}

export interface RemoveCustomThemeSwatchAction {
  type: "ai_remove_custom_theme_swatch"
  payload: {
    key: ThemeCustomSwatchId
  }
}

export interface UpdateCustomThemeSwatchAction {
  type: "ai_update_custom_theme_swatch"
  payload: {
    key: ThemeCustomSwatchId
    name?: string
    intent?: string
    value?: HSL
  }
}

export interface SetCustomThemeCoreRatioAction {
  type: "ai_set_custom_theme_core_ratio"
  payload: { value: Ratio }
}

export interface SetCustomThemeCoreFontSizeAction {
  type: "ai_set_custom_theme_core_font_size"
  payload: { value: number }
}

export interface SetCustomThemeCoreSizeAction {
  type: "ai_set_custom_theme_core_size"
  payload: { value: number }
}

export interface SetCustomThemeFontFamilyValueAction {
  type: "ai_set_custom_theme_font_family_value"
  payload: { key: ThemeFontFamilyId; value: string }
}

export interface SetCustomThemeBaseColorAction {
  type: "ai_set_custom_theme_base_color"
  payload: { value: HSL }
}

export interface SetCustomThemeHarmonyAction {
  type: "ai_set_custom_theme_harmony"
  payload: { value: Harmony }
}

export interface SetCustomThemeColorValueAction {
  type: "ai_set_custom_theme_color_value"
  payload: {
    key:
      | "angle"
      | "step"
      | "whitePoint"
      | "grayPoint"
      | "blackPoint"
      | "bleed"
      | "contrastRatio"
    value: number
  }
}

export interface SetCustomThemeDefaultIconColorAction {
  type: "ai_set_custom_theme_default_icon_color"
  payload: { value: ColorThemeValue | HSLValue | RGBValue | HexValue }
}

export interface SetCustomThemeDefaultIconSizeAction {
  type: "ai_set_custom_theme_default_icon_size"
  payload: { value: SizeValue }
}

export interface SetCustomThemeBorderWidthValueAction {
  type: "ai_set_custom_theme_border_width_value"
  payload: {
    key: ThemeBorderWidthId
    value: ModulationParameters | "hairline"
  }
}

export interface SetCustomThemeCornersValueAction {
  type: "ai_set_custom_theme_corners_value"
  payload: { key: ThemeCornersId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemeFontValueAction {
  type: "ai_set_custom_theme_font_value"
  payload: { key: ThemeFontId; value: Partial<FontParameters> }
}

export interface SetCustomThemeFontSizeValueAction {
  type: "ai_set_custom_theme_font_size_value"
  payload: { key: ThemeFontSizeId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemeFontWeightValueAction {
  type: "ai_set_custom_theme_font_weight_value"
  payload: { key: ThemeFontWeightId; value: number }
}

export interface SetCustomThemeSizeValueAction {
  type: "ai_set_custom_theme_size_value"
  payload: { key: ThemeSizeId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemeDimensionValueAction {
  type: "ai_set_custom_theme_dimension_value"
  payload: { key: ThemeDimensionId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemeMarginValueAction {
  type: "ai_set_custom_theme_margin_value"
  payload: { key: ThemeSpacingId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemePaddingValueAction {
  type: "ai_set_custom_theme_padding_value"
  payload: { key: ThemeSpacingId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemeGapValueAction {
  type: "ai_set_custom_theme_gap_value"
  payload: { key: ThemeSpacingId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemeLineHeightValueAction {
  type: "ai_set_custom_theme_line_height_value"
  payload: { key: ThemeLineHeightId; value: number }
}

export interface SetCustomThemeShadowValueAction {
  type: "ai_set_custom_theme_shadow_value"
  payload: { key: ThemeShadowId; value: Partial<ShadowParameters> }
}

export interface SetCustomThemeBorderValueAction {
  type: "ai_set_custom_theme_border_value"
  payload: { key: ThemeBorderId; value: BorderParameters }
}

export interface SetCustomThemeBlurValueAction {
  type: "ai_set_custom_theme_blur_value"
  payload: { key: ThemeSizeId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemeSpreadValueAction {
  type: "ai_set_custom_theme_spread_value"
  payload: { key: ThemeSizeId; value: Partial<ModulationParameters> }
}

export interface SetCustomThemeGradientValueAction {
  type: "ai_set_custom_theme_gradient_value"
  payload: { key: ThemeGradientId; value: Partial<GradientParameters> }
}

export interface SetCustomThemeBackgroundValueAction {
  type: "ai_set_custom_theme_background_value"
  payload: { key: ThemeBackgroundId; value: Partial<BackgroundParameters> }
}

export interface SetCustomThemeScrollbarValueAction {
  type: "ai_set_custom_theme_scrollbar_value"
  payload: { key: ThemeScrollbarId; value: Partial<ScrollbarParameters> }
}

// Transcript Actions
export interface TranscriptAddMessageAction {
  type: "ai_transcript_add_message"
  payload: {
    chatMessage: string
    expectUserAnswer: boolean
  }
}

// Union type for all AI actions
export type AIAction =
  | AddComponentAction
  | RemoveComponentAction
  | ReorderBoardAction
  | AddVariantAction
  | InsertNodeAction
  | DuplicateNodeAction
  | RemoveNodeAction
  | MoveNodeAction
  | ReorderNodeAction
  | SetNodePropertiesAction
  | SetNodeLabelAction
  | SetNodeThemeAction
  | ResetNodePropertyAction
  | SetBoardPropertiesAction
  | SetBoardThemeAction
  | ResetCustomThemeAction
  | AddCustomThemeSwatchAction
  | RemoveCustomThemeSwatchAction
  | UpdateCustomThemeSwatchAction
  | SetCustomThemeCoreRatioAction
  | SetCustomThemeCoreFontSizeAction
  | SetCustomThemeCoreSizeAction
  | SetCustomThemeFontFamilyValueAction
  | SetCustomThemeBaseColorAction
  | SetCustomThemeHarmonyAction
  | SetCustomThemeColorValueAction
  | SetCustomThemeDefaultIconColorAction
  | SetCustomThemeDefaultIconSizeAction
  | SetCustomThemeBorderWidthValueAction
  | SetCustomThemeCornersValueAction
  | SetCustomThemeFontValueAction
  | SetCustomThemeFontSizeValueAction
  | SetCustomThemeFontWeightValueAction
  | SetCustomThemeSizeValueAction
  | SetCustomThemeDimensionValueAction
  | SetCustomThemeMarginValueAction
  | SetCustomThemePaddingValueAction
  | SetCustomThemeGapValueAction
  | SetCustomThemeLineHeightValueAction
  | SetCustomThemeShadowValueAction
  | SetCustomThemeBorderValueAction
  | SetCustomThemeBlurValueAction
  | SetCustomThemeSpreadValueAction
  | SetCustomThemeGradientValueAction
  | SetCustomThemeBackgroundValueAction
  | SetCustomThemeScrollbarValueAction
  | TranscriptAddMessageAction
