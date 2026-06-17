import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

/** How this layer mixes with content already drawn behind it. */
export enum BackgroundBlendMode {
  NORMAL = "normal",
  MULTIPLY = "multiply",
  SCREEN = "screen",
  OVERLAY = "overlay",
  DARKEN = "darken",
  LIGHTEN = "lighten",
  COLOR_DODGE = "color-dodge",
  COLOR_BURN = "color-burn",
  HARD_LIGHT = "hard-light",
  SOFT_LIGHT = "soft-light",
  DIFFERENCE = "difference",
  EXCLUSION = "exclusion",
  HUE = "hue",
  SATURATION = "saturation",
  COLOR = "color",
  LUMINOSITY = "luminosity",
}

export const BACKGROUND_BLEND_MODE_VALUES = Object.values(
  BackgroundBlendMode,
) as BackgroundBlendMode[]

/** Stores one blend mode choice from the enum. */
export interface BackgroundBlendModeOptionValue {
  type: ValueType.OPTION
  value: BackgroundBlendMode
}

/** Empty or one named blend mode choice. */
export type BackgroundBlendModeValue =
  | EmptyValue
  | BackgroundBlendModeOptionValue

/** Validates blend mode choice on one background paint layer. */
export const backgroundBlendModeSchema: PropertySchema = {
  name: "backgroundBlendMode",
  description:
    "Sets how this layer mixes with what is already drawn behind it.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      BACKGROUND_BLEND_MODE_VALUES.includes(value as BackgroundBlendMode),
  },
  presetOptions: () => BACKGROUND_BLEND_MODE_VALUES,
}
