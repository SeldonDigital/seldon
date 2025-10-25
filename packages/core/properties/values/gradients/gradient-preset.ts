import { ThemeGradientKey } from "../../../themes/types"
import { Theme } from "../../../themes/types"
import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export interface GradientPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeGradientKey
}

export const gradientPresetSchema: PropertySchema = {
  name: "gradientPreset",
  description: "Gradient theme preset",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.gradient
    },
  },
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.gradient),
}
