import { EmptyValue } from "../../shared/empty/empty"
import type { GradientValue } from "./gradient"
import { GradientAngleValue } from "./gradient-angle"
import { GradientStopBrightnessValue } from "./gradient-stop-brightness"
import { GradientStopColorValue } from "./gradient-stop-color"
import { GradientStopOpacityValue } from "./gradient-stop-opacity"
import { GradientStopPositionValue } from "./gradient-stop-position"
import { GradientTypeValue } from "./gradient-type"

/** One gradient paint layer with optional theme recipe and stop fields. */
export interface GradientCompound {
  preset?: GradientValue | EmptyValue
  gradientType?: GradientTypeValue | EmptyValue
  angle?: GradientAngleValue | EmptyValue
  startColor?: GradientStopColorValue | EmptyValue
  startOpacity?: GradientStopOpacityValue | EmptyValue
  startBrightness?: GradientStopBrightnessValue | EmptyValue
  startPosition?: GradientStopPositionValue | EmptyValue
  endColor?: GradientStopColorValue | EmptyValue
  endOpacity?: GradientStopOpacityValue | EmptyValue
  endBrightness?: GradientStopBrightnessValue | EmptyValue
  endPosition?: GradientStopPositionValue | EmptyValue
}

export * from "./gradient"
export * from "./gradient-type"
export * from "./gradient-angle"
export * from "./gradient-stop-color"
export * from "./gradient-stop-brightness"
export * from "./gradient-stop-opacity"
export * from "./gradient-stop-position"
