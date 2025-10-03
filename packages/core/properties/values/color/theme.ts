import { ThemeSwatchKey } from "../../../themes/types"
import { ValueType } from "../../constants/value-types"

export interface ColorThemeValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeSwatchKey
}
