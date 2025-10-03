import { ThemeShadowKey, ThemeSwatchKey } from "../../../../themes/types"
import { Restricted } from "../../../types/helpers"
import { EmptyValue } from "../../shared/empty"
import { ShadowBlurValue } from "./shadow-blur"
import { ShadowBrightnessValue } from "./shadow-brightness"
import { ShadowColorValue } from "./shadow-color"
import { ShadowOffsetValue } from "./shadow-offset"
import { ShadowOpacityValue } from "./shadow-opacity"
import { ShadowPresetValue } from "./shadow-preset"
import { ShadowSpreadValue } from "./shadow-spread"

export interface ShadowValue {
  preset?: Restricted<ShadowPresetValue | EmptyValue, ThemeShadowKey>
  offsetX?: ShadowOffsetValue | EmptyValue
  offsetY?: ShadowOffsetValue | EmptyValue
  blur?: Restricted<ShadowBlurValue | EmptyValue, string>
  spread?: Restricted<ShadowSpreadValue | EmptyValue, string>
  color?: Restricted<ShadowColorValue | EmptyValue, ThemeSwatchKey>
  brightness?: ShadowBrightnessValue | EmptyValue
  opacity?: ShadowOpacityValue | EmptyValue
}

export * from "./shadow-blur"
export * from "./shadow-color"
export * from "./shadow-offset"
export * from "./shadow-opacity"
export * from "./shadow-preset"
export * from "./shadow-spread"
