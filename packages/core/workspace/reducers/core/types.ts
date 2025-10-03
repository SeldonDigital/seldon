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
import { InstanceId, VariantId, Workspace } from "../../types"

export type CoreAction =
  | {
      /**
       * Reset the entire tree to a new tree
       */
      type: "set_workspace"
      payload: {
        workspace: Workspace
      }
    }
  | {
      /**
       * Adds a component (board) to the tree.
       */
      type: "add_board"
      payload: {
        componentId: ComponentId
      }
    }
  | {
      /**
       * Removes a component (board) from the tree.
       */
      type: "remove_board"
      payload: {
        componentId: ComponentId
      }
    }
  | {
      /** Add a variant. If properties are not provided, we use the properties of the default variant */
      type: "add_variant"
      payload: {
        componentId: ComponentId
        properties?: Properties
      }
    }
  | {
      /**
       * Move a board to a new index
       */
      type: "reorder_board"
      payload: {
        componentId: ComponentId
        newIndex: number
      }
    }
  | {
      /**
       * Inserts a node inside another node at a specific index
       */
      type: "insert_node"
      payload: {
        nodeId: VariantId | InstanceId
        target: {
          parentId: VariantId | InstanceId
          index?: number
        }
      }
    }
  | {
      /**
       * Creates a default variant and inserts it inside another node at a specific index
       */
      type: "add_board_and_insert_default_variant"
      payload: {
        componentId: ComponentId
        target: {
          parentId: VariantId | InstanceId
          index?: number
        }
      }
    }
  | {
      /**
       * Remove a child
       */
      type: "remove_node"
      payload: {
        nodeId: VariantId | InstanceId
      }
    }
  | {
      /**
       * Duplicate a node
       */
      type: "duplicate_node"
      payload: {
        nodeId: VariantId | InstanceId
      }
    }
  | {
      /**
       * Set the properties of a node
       */
      type: "set_node_properties"
      payload: {
        nodeId: InstanceId | VariantId
        properties: Properties
        options?: {
          mergeSubProperties?: boolean
        }
      }
    }
  | {
      /**
       * Reset the properties of a node
       */
      type: "reset_node_property"
      payload: {
        nodeId: InstanceId | VariantId
        propertyKey: PropertyKey
        subpropertyKey?: SubPropertyKey
      }
    }
  | {
      /**
       * Set the properties of a board
       */
      type: "set_board_properties"
      payload: {
        componentId: ComponentId
        properties: Properties
      }
    }
  | {
      /**
       * Reset the properties of a board
       */
      type: "reset_board_property"
      payload: {
        componentId: ComponentId
        propertyKey: PropertyKey
        subpropertyKey?: SubPropertyKey
      }
    }
  | {
      /**
       * Rename node
       */
      type: "set_node_label"
      payload: {
        nodeId: VariantId
        label: string
      }
    }
  | {
      /**
       * Set node theme
       */
      type: "set_node_theme"
      payload: {
        nodeId: InstanceId | VariantId
        theme: ThemeId | null
      }
    }
  | {
      /**
       * Set board theme
       */
      type: "set_board_theme"
      payload: {
        componentId: ComponentId
        theme: ThemeId
      }
    }
  | {
      /**
       * Move a node to a new parent and index
       */
      type: "move_node"
      payload: {
        nodeId: InstanceId
        target: {
          parentId: VariantId | InstanceId
          index?: number
        }
      }
    }
  | {
      /**
       * Move a node to a new index within its parent
       */
      type: "reorder_node"
      payload: {
        nodeId: InstanceId | VariantId
        newIndex: number
      }
    }
  | {
      // Reset the custom theme to default
      type: "reset_custom_theme"
      payload: {}
    }
  | {
      type: "set_custom_theme_core_ratio"
      payload: { value: Ratio }
    }
  | {
      type: "set_custom_theme_core_font_size"
      payload: { value: number }
    }
  | {
      type: "set_custom_theme_core_size"
      payload: { value: number }
    }
  | {
      type: "set_custom_theme_base_color"
      payload: { value: HSL }
    }
  | {
      type: "set_custom_theme_harmony"
      payload: { value: Harmony }
    }
  | {
      type: "set_custom_theme_color_value"
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
  | {
      type: "set_custom_theme_default_icon_color"
      payload: { value: ColorThemeValue | HSLValue | RGBValue | HexValue }
    }
  | {
      type: "set_custom_theme_default_icon_size"
      payload: { value: SizeValue }
    }
  | {
      type: "set_custom_theme_border_width_value"
      payload: {
        key: ThemeBorderWidthId
        value: ModulationParameters | "hairline"
      }
    }
  | {
      type: "set_custom_theme_corners_value"
      payload: { key: ThemeCornersId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_font_family_value"
      payload: { key: ThemeFontFamilyId; value: string }
    }
  | {
      type: "set_custom_theme_font_value"
      payload: { key: ThemeFontId; value: Partial<FontParameters> }
    }
  | {
      type: "set_custom_theme_font_size_value"
      payload: { key: ThemeFontSizeId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_font_weight_value"
      payload: { key: ThemeFontWeightId; value: number }
    }
  | {
      type: "set_custom_theme_size_value"
      payload: { key: ThemeSizeId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_dimension_value"
      payload: { key: ThemeDimensionId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_margin_value"
      payload: { key: ThemeSpacingId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_padding_value"
      payload: { key: ThemeSpacingId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_gap_value"
      payload: { key: ThemeSpacingId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_line_height_value"
      payload: { key: ThemeLineHeightId; value: number }
    }
  | {
      type: "set_custom_theme_shadow_value"
      payload: { key: ThemeShadowId; value: Partial<ShadowParameters> }
    }
  | {
      type: "set_custom_theme_border_value"
      payload: { key: ThemeBorderId; value: Partial<BorderParameters> }
    }
  | {
      type: "set_custom_theme_blur_value"
      payload: { key: ThemeSizeId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_spread_value"
      payload: { key: ThemeSizeId; value: Partial<ModulationParameters> }
    }
  | {
      type: "set_custom_theme_gradient_value"
      payload: { key: ThemeGradientId; value: Partial<GradientParameters> }
    }
  | {
      type: "set_custom_theme_background_value"
      payload: { key: ThemeBackgroundId; value: Partial<BackgroundParameters> }
    }
  | {
      type: "set_custom_theme_scrollbar_value"
      payload: { key: ThemeScrollbarId; value: Partial<ScrollbarParameters> }
    }
  | {
      /**
       * Add a custom swatch
       */
      type: "add_custom_theme_swatch"
      payload: {
        name: string
        intent: string
        value: HSL
      }
    }
  | {
      /**
       * Remove a custom swatch
       */
      type: "remove_custom_theme_swatch"
      payload: {
        key: ThemeCustomSwatchId
      }
    }
  | {
      /**
       * Update a custom swatch value
       */
      type: "update_custom_theme_swatch"
      payload: {
        key: ThemeCustomSwatchId
        name?: string
        intent?: string
        value?: HSL
      }
    }
  | {
      /**
       * Add a message to the transcript
       */
      type: "transcript_add_message"
      payload: {
        chatMessage: string
        expectUserAnswer: boolean
      }
    }
