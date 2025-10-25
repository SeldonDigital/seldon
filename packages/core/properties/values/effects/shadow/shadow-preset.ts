import { ThemeShadowKey } from "../../../../themes/types"
import { Theme } from "../../../../themes/types"
import { ValueType } from "../../../constants"
import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"

export interface ShadowPresetThemeValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeShadowKey
}

export type ShadowPresetValue = EmptyValue | ShadowPresetThemeValue

export const shadowPresetSchema: PropertySchema = {
  name: "shadowPreset",
  description: "Shadow theme preset",
  supports: ["empty", "inherit", "themeCategorical"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    themeCategorical: (value: any, theme?: Theme) => {
      if (!theme) return false
      return value in theme.shadow
    },
  },
  themeCategoricalKeys: (theme: Theme) => Object.keys(theme.shadow),
}
