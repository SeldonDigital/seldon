import {
  listThemeLookIds,
  validateThemeLookPresetRef,
} from "../../../../themes/looks"
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
    "Selects a named border recipe from the theme, including the built-in None look.",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: unknown, theme?: Theme) =>
      validateThemeLookPresetRef("border", value, theme),
  },
  themeCategoricalKeys: (theme: Theme) => listThemeLookIds(theme, "border"),
}
