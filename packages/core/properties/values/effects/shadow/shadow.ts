import { listThemeLookIds, validateThemeLookPresetRef } from "../../../../themes/looks"

import type { Theme, ThemeShadowKey } from "../../../../themes/types"
import type { ValueType } from "../../../constants"
import type { PropertySchema } from "../../../types/schema"

/** Theme categorical reference to a named recipe under `theme.shadow`. */
export interface ShadowValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeShadowKey
}

/** Validates stored shadow theme recipe picks. */
export const shadowPresetSchema: PropertySchema = {
  name: "shadowPreset",
  description: "Selects a named shadow recipe from the theme, including the built-in None look.",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: unknown, theme?: Theme) =>
      validateThemeLookPresetRef("shadow", value, theme),
  },
  themeCategoricalKeys: (theme: Theme) => listThemeLookIds(theme, "shadow"),
}
