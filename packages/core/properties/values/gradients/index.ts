import { ThemeGradientKey, ThemeSwatchKey } from "../../../themes/types"
import { Restricted } from "../../types/helpers"
import { GradientType } from "../../values"
import { EmptyValue } from "../shared/empty/empty"
import { GradientAngleValue } from "./gradient-angle"
import { GradientPresetValue } from "./gradient-preset"
import { GradientStopBrightnessValue } from "./gradient-stop-brightness"
import { GradientStopColorValue } from "./gradient-stop-color"
import { GradientStopOpacityValue } from "./gradient-stop-opacity"
import { GradientStopPositionValue } from "./gradient-stop-position"
import { GradientTypeValue } from "./gradient-type"

export interface GradientValue {
  preset?: GradientPresetValue | EmptyValue
  gradientType?: Restricted<GradientTypeValue | EmptyValue, GradientType>
  angle?: GradientAngleValue | EmptyValue
  startColor?: Restricted<GradientStopColorValue | EmptyValue, ThemeSwatchKey>
  startOpacity?: GradientStopOpacityValue | EmptyValue
  startBrightness?: GradientStopBrightnessValue | EmptyValue
  startPosition?: GradientStopPositionValue | EmptyValue
  endColor?: Restricted<GradientStopColorValue | EmptyValue, ThemeSwatchKey>
  endOpacity?: GradientStopOpacityValue | EmptyValue
  endBrightness?: GradientStopBrightnessValue | EmptyValue
  endPosition?: GradientStopPositionValue | EmptyValue
}

export * from "./gradient-angle"
export * from "./gradient-preset"
export * from "./gradient-stop-brightness"
export * from "./gradient-stop-color"
export * from "./gradient-stop-opacity"
export * from "./gradient-stop-position"
export * from "./gradient-type"
