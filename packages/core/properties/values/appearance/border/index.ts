import { EmptyValue } from "../../shared/empty/empty"
import { BorderCollapseValue } from "../border-collapse"
import type { BorderValue } from "./border"
import { BorderBrightnessValue } from "./border-brightness"
import { BorderColorValue } from "./border-color"
import { BorderOpacityValue } from "./border-opacity"
import { BorderStyleValue } from "./border-style"
import { BorderWidthValue } from "./border-width"

/** One border compound with optional theme recipe and per-field picks. */
export interface BorderCompound {
  preset?: BorderValue | EmptyValue
  style?: BorderStyleValue | EmptyValue
  color?: BorderColorValue | EmptyValue
  width?: BorderWidthValue | EmptyValue
  brightness?: BorderBrightnessValue | EmptyValue
  opacity?: BorderOpacityValue | EmptyValue
  collapse?: BorderCollapseValue | EmptyValue
}

export * from "./border"
export * from "./border-style"
export * from "./border-color"
export * from "./border-width"
export * from "./border-brightness"
export * from "./border-opacity"
