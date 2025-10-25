import { ThemeBorderKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"

export interface BorderPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeBorderKey
}

export const borderPresetSchema: PropertySchema = {
  name: "borderPreset",
  description: "Border theme preset",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.border
    },
  },
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.border),
}
