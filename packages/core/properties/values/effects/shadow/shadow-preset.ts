import { ThemeShadowKey } from "../../../../themes/types"
import { ValueType } from "../../../constants"

export interface ShadowPresetValue {
  type: ValueType.THEME_CATEGORICAL
  value: ThemeShadowKey
}
