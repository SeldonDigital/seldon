import { EmptyValue } from "../../shared/empty/empty"
import type { ShadowValue } from "./shadow"
import { ShadowBlurValue } from "./shadow-blur"
import { ShadowBrightnessValue } from "./shadow-brightness"
import { ShadowColorValue } from "./shadow-color"
import { ShadowOffsetValue } from "./shadow-offset"
import { ShadowOpacityValue } from "./shadow-opacity"
import { ShadowSpreadValue } from "./shadow-spread"
import { ShadowStyleValue } from "./shadow-style"

export interface ShadowCompound {
  preset?: ShadowValue | EmptyValue
  style?: ShadowStyleValue | EmptyValue
  offsetX?: ShadowOffsetValue | EmptyValue
  offsetY?: ShadowOffsetValue | EmptyValue
  blur?: ShadowBlurValue | EmptyValue
  color?: ShadowColorValue | EmptyValue
  brightness?: ShadowBrightnessValue | EmptyValue
  opacity?: ShadowOpacityValue | EmptyValue
  spread?: ShadowSpreadValue | EmptyValue
}

export * from "./shadow"
export * from "./shadow-style"
export * from "./shadow-offset"
export * from "./shadow-blur"
export * from "./shadow-color"
export * from "./shadow-brightness"
export * from "./shadow-opacity"
export * from "./shadow-spread"
