import { ValueType } from "../../../constants"

export interface FontFamilyPresetValue {
  type: ValueType.PRESET
  value: string
}

export interface FontFamilyThemeValue {
  type: ValueType.THEME_CATEGORICAL
  value: "@fontFamily.primary" | "@fontFamily.secondary"
}

export type FontFamilyValue = FontFamilyPresetValue | FontFamilyThemeValue
