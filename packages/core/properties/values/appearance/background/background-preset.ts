import { ThemeBackgroundKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"

export interface BackgroundPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeBackgroundKey
}

export const backgroundPresetSchema: PropertySchema = {
  name: "backgroundPreset",
  description: "Background theme preset",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.background
    },
  },
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.background),
}
