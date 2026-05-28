import { Theme, ThemeGradientKey } from "../../../../themes/types"
import {
  listThemeLookIds,
  validateThemeLookPresetRef,
} from "../../../../themes/looks"
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
    "Selects a named gradient recipe from the theme, including the built-in None look.",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: unknown, theme?: Theme) =>
      validateThemeLookPresetRef("gradient", value, theme),
  },
  themeCategoricalKeys: (theme: Theme) => listThemeLookIds(theme, "gradient"),
}
