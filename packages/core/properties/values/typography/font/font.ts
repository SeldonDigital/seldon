import {
  listThemeLookIds,
  validateThemeLookPresetRef,
} from "../../../../themes/looks"
import { Theme, ThemeFontKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"

/** Theme categorical reference to a named recipe under `theme.font`. */
export interface FontValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeFontKey
}

/** Validates stored font theme recipe picks. */
export const fontPresetSchema: PropertySchema = {
  name: "fontPreset",
  description:
    "Selects a named font recipe from the theme, including the built-in Normal look.",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: unknown, theme?: Theme) =>
      validateThemeLookPresetRef("font", value, theme),
  },
  themeCategoricalKeys: (theme: Theme) => listThemeLookIds(theme, "font"),
}
