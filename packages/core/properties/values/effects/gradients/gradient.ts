import { Theme, ThemeGradientKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"

/** Theme categorical reference to a named recipe under `theme.gradient`. */
export interface GradientValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeGradientKey
}

/** Validates stored gradient theme recipe picks. */
export const gradientPresetSchema: PropertySchema = {
  name: "gradientPreset",
  description:
    "Selects a named gradient recipe from the theme or clears it with None.",
  supports: ["empty", "inherit", "option", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => value === "None",
    themeCategorical: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.gradient
    },
  },
  presetOptions: () => ["None"],
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.gradient),
}
