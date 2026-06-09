import {
  listThemeLookIds,
  validateThemeLookPresetRef,
} from "../../../../themes/looks"
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
    "Selects a named layer recipe from the theme, including the built-in None look.",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: unknown, theme?: Theme) =>
      validateThemeLookPresetRef("background", value, theme),
  },
  themeCategoricalKeys: (theme: Theme) => listThemeLookIds(theme, "background"),
}
