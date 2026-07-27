import type { EmptyValue } from "../../shared/empty/empty"
import type { ShadowValue } from "./shadow"
import type { ShadowBlurValue } from "./shadow-blur"
import type { ShadowBrightnessValue } from "./shadow-brightness"
import type { ShadowColorValue } from "./shadow-color"
import type { ShadowOffsetValue } from "./shadow-offset"
import type { ShadowOpacityValue } from "./shadow-opacity"
import type { ShadowSpreadValue } from "./shadow-spread"
import type { ShadowStyleValue } from "./shadow-style"

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
