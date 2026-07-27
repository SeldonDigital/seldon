import type { EmptyValue } from "../../shared/empty/empty"
import type { BorderValue } from "./border"
import type { BorderBrightnessValue } from "./border-brightness"
import type { BorderColorValue } from "./border-color"
import type { BorderOpacityValue } from "./border-opacity"
import type { BorderStyleValue } from "./border-style"
import type { BorderWidthValue } from "./border-width"

/** One border compound with optional theme recipe and per-field picks. */
export interface BorderCompound {
  preset?: BorderValue | EmptyValue
  style?: BorderStyleValue | EmptyValue
  color?: BorderColorValue | EmptyValue
  width?: BorderWidthValue | EmptyValue
  brightness?: BorderBrightnessValue | EmptyValue
  opacity?: BorderOpacityValue | EmptyValue
}

export * from "./border"
export * from "./border-style"
export * from "./border-color"
export * from "./border-width"
export * from "./border-brightness"
export * from "./border-opacity"
