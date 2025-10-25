import { ThemeFontKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"

export interface FontPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeFontKey
}

export const fontPresetSchema: PropertySchema = {
  name: "fontPreset",
  description: "Font theme preset",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.font
    },
  },
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.font),
}
