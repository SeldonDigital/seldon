import {
  ThemeBorderKey,
  ThemeBorderWidthKey,
  ThemeSwatchKey,
} from "../../../../themes/types"
import { BorderStyle } from "../../../constants"
import { Restricted } from "../../../types/helpers"
import { EmptyValue } from "../../shared/empty"
import { BorderBrightnessValue } from "./border-brightness"
import { BorderColorValue } from "./border-color"
import { BorderOpacityValue } from "./border-opacity"
import { BorderPresetValue } from "./border-preset"
import { BorderStyleValue } from "./border-style"
import { BorderWidthValue } from "./border-width"

export interface BorderValue {
  preset?: Restricted<BorderPresetValue | EmptyValue, ThemeBorderKey>
  style?: Restricted<BorderStyleValue | EmptyValue, BorderStyle>
  color?: Restricted<BorderColorValue | EmptyValue, ThemeSwatchKey>
  width?: Restricted<BorderWidthValue | EmptyValue, ThemeBorderWidthKey>
  opacity?: BorderOpacityValue | EmptyValue
  brightness?: BorderBrightnessValue | EmptyValue
  topStyle?: Restricted<BorderStyleValue | EmptyValue, BorderStyle>
  topColor?: Restricted<BorderColorValue | EmptyValue, ThemeSwatchKey>
  topWidth?: Restricted<BorderWidthValue | EmptyValue, ThemeBorderWidthKey>
  topOpacity?: BorderOpacityValue | EmptyValue
  topBrightness?: BorderBrightnessValue | EmptyValue
  rightStyle?: Restricted<BorderStyleValue | EmptyValue, BorderStyle>
  rightColor?: Restricted<BorderColorValue | EmptyValue, ThemeSwatchKey>
  rightWidth?: Restricted<BorderWidthValue | EmptyValue, ThemeBorderWidthKey>
  rightOpacity?: BorderOpacityValue | EmptyValue
  rightBrightness?: BorderBrightnessValue | EmptyValue
  bottomStyle?: Restricted<BorderStyleValue | EmptyValue, BorderStyle>
  bottomColor?: Restricted<BorderColorValue | EmptyValue, ThemeSwatchKey>
  bottomWidth?: Restricted<BorderWidthValue | EmptyValue, ThemeBorderWidthKey>
  bottomOpacity?: BorderOpacityValue | EmptyValue
  bottomBrightness?: BorderBrightnessValue | EmptyValue
  leftStyle?: Restricted<BorderStyleValue | EmptyValue, BorderStyle>
  leftColor?: Restricted<BorderColorValue | EmptyValue, ThemeSwatchKey>
  leftWidth?: Restricted<BorderWidthValue | EmptyValue, ThemeBorderWidthKey>
  leftOpacity?: BorderOpacityValue | EmptyValue
  leftBrightness?: BorderBrightnessValue | EmptyValue
}

export * from "./border-color"
export * from "./border-opacity"
export * from "./border-preset"
export * from "./border-style"
export * from "./border-width"
