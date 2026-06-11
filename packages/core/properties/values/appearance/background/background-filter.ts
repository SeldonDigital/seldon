import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { StringValue } from "../../shared/exact/string"

const BACKGROUND_FILTER_PRESETS = [
  { name: "Blur", value: "blur(4px)" },
  { name: "Brightness", value: "brightness(1.2)" },
  { name: "Contrast", value: "contrast(1.1)" },
  { name: "Grayscale", value: "grayscale(1)" },
  { name: "Saturate", value: "saturate(1.2)" },
  { name: "Sepia", value: "sepia(0.5)" },
  { name: "Invert", value: "invert(1)" },
] as const

export const BACKGROUND_FILTER_PRESET_VALUES = BACKGROUND_FILTER_PRESETS.map(
  (preset) => preset.value,
)

/** Stores one filter preset choice from the catalog list. */
export interface BackgroundFilterOptionValue {
  type: ValueType.OPTION
  value: (typeof BACKGROUND_FILTER_PRESET_VALUES)[number]
}

/** Empty, one preset choice, or a custom filter string. */
export type BackgroundFilterValue =
  | EmptyValue
  | BackgroundFilterOptionValue
  | StringValue

function isPresetFilterValue(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (BACKGROUND_FILTER_PRESET_VALUES as readonly string[]).includes(value)
  )
}

/** Validates filter strings on one background paint layer. */
export const backgroundFilterSchema: PropertySchema = {
  name: "backgroundFilter",
  description: "Sets stacked blur and color treatments for this layer.",
  supports: ["empty", "inherit", "option", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => isPresetFilterValue(value),
    exact: (value: unknown) => typeof value === "string" && value.length > 0,
  },
  presetOptions: () => [...BACKGROUND_FILTER_PRESETS],
}
