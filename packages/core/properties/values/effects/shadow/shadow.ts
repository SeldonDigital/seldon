import { Theme, ThemeShadowKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"

/** Theme categorical reference to a named recipe under `theme.shadow`. */
export interface ShadowValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeShadowKey
}

/** Validates stored shadow theme recipe picks. */
export const shadowPresetSchema: PropertySchema = {
  name: "shadowPreset",
  description:
    "Selects a named shadow recipe from the theme or clears it with None.",
  supports: ["empty", "inherit", "option", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) => value === "None",
    themeCategorical: (value: unknown, theme?: Theme) => {
      if (!theme || typeof value !== "string") return false
      return value in theme.shadow
    },
  },
  presetOptions: () => ["None"],
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.shadow),
}
