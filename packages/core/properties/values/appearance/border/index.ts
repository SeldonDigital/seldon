import {
  ThemeBorderKey,
  ThemeBorderWidthKey,
  ThemeSwatchKey,
} from "../../../../themes/types"
import { Restricted } from "../../../types/helpers"
import { BorderCollapse, BorderStyle } from "../../../values"
import { EmptyValue } from "../../shared/empty/empty"
import { BorderCollapseValue } from "../border-collapse"
import { BorderBrightnessValue } from "./border-brightness"
import { BorderColorValue } from "./border-color"
import { BorderOpacityValue } from "./border-opacity"
import { BorderStyleValue } from "./border-style"
import { BorderWidthValue } from "./border-width"
import type { BorderValue } from "./border"

/** One border compound with optional theme recipe and per-field picks. */
export interface BorderCompound {
  preset?: Restricted<BorderValue | EmptyValue, ThemeBorderKey>
  style?: Restricted<BorderStyleValue | EmptyValue, BorderStyle>
  color?: Restricted<BorderColorValue | EmptyValue, ThemeSwatchKey>
  width?: Restricted<BorderWidthValue | EmptyValue, ThemeBorderWidthKey>
  brightness?: BorderBrightnessValue | EmptyValue
  opacity?: BorderOpacityValue | EmptyValue
  collapse?: Restricted<BorderCollapseValue | EmptyValue, BorderCollapse>
}

export * from "./border"
export * from "./border-style"
export * from "./border-color"
export * from "./border-width"
export * from "./border-brightness"
export * from "./border-opacity"
