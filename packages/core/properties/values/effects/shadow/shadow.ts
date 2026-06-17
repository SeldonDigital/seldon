import {
  listThemeLookIds,
  validateThemeLookPresetRef,
} from "../../../../themes/looks"
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
    "Selects a named shadow recipe from the theme, including the built-in None look.",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: unknown, theme?: Theme) =>
      validateThemeLookPresetRef("shadow", value, theme),
  },
  themeCategoricalKeys: (theme: Theme) => listThemeLookIds(theme, "shadow"),
}
