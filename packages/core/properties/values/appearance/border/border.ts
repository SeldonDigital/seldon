import { Theme, ThemeBorderKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"

/** Theme categorical reference to a named recipe under `theme.border`. */
export interface BorderValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeBorderKey
}

export const borderPresetSchema: PropertySchema = {
  name: "borderPreset",
  description:
    "Selects a named border recipe from the theme or clears it with None.",
  supports: ["empty", "inherit", "option", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => value === "None",
    themeCategorical: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.border
    },
  },
  presetOptions: () => ["None"],
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.border),
}
