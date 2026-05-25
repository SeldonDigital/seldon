import { Theme, ThemeBackgroundKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"

/** Theme categorical reference to a named recipe under `theme.background`. */
export interface BackgroundValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeBackgroundKey
}

export const backgroundPresetSchema: PropertySchema = {
  name: "backgroundPreset",
  description:
    "Selects a named layer recipe from the theme or clears it with None.",
  supports: ["empty", "inherit", "option", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => value === "None",
    themeCategorical: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.background
    },
  },
  presetOptions: () => ["None"],
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.background),
}
