import { ThemeShadowKey, ThemeSwatchKey } from "../../../../themes/types"
import { Restricted } from "../../../types/helpers"
import { EmptyValue } from "../../shared/empty/empty"
import { ShadowBlurValue } from "./shadow-blur"
import { ShadowBrightnessValue } from "./shadow-brightness"
import { ShadowColorValue } from "./shadow-color"
import { ShadowOffsetValue } from "./shadow-offset"
import { ShadowOpacityValue } from "./shadow-opacity"
import { ShadowSpreadValue } from "./shadow-spread"
import type { ShadowValue } from "./shadow"

export interface ShadowCompound {
  preset?: Restricted<ShadowValue | EmptyValue, ThemeShadowKey>
  offsetX?: ShadowOffsetValue | EmptyValue
  offsetY?: ShadowOffsetValue | EmptyValue
  blur?: Restricted<ShadowBlurValue | EmptyValue, string>
  color?: Restricted<ShadowColorValue | EmptyValue, ThemeSwatchKey>
  brightness?: ShadowBrightnessValue | EmptyValue
  opacity?: ShadowOpacityValue | EmptyValue
  spread?: Restricted<ShadowSpreadValue | EmptyValue, string>
}

export * from "./shadow"
export * from "./shadow-offset"
export * from "./shadow-blur"
export * from "./shadow-color"
export * from "./shadow-brightness"
export * from "./shadow-opacity"
export * from "./shadow-spread"
