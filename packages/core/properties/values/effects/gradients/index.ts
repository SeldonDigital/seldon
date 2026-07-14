import { EmptyValue } from "../../shared/empty/empty"
import type { GradientValue } from "./gradient"
import { GradientAngleValue } from "./gradient-angle"
import { GradientPositionValue } from "./gradient-position"
import { GradientRepeatValue } from "./gradient-repeat"
import { GradientShapeValue } from "./gradient-shape"
import { GradientSizeValue } from "./gradient-size"
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
  positionX?: GradientPositionValue | EmptyValue
  positionY?: GradientPositionValue | EmptyValue
  shape?: GradientShapeValue | EmptyValue
  radialSize?: GradientSizeValue | EmptyValue
  conicRepeat?: GradientRepeatValue | EmptyValue
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
export * from "./gradient-position"
export * from "./gradient-shape"
export * from "./gradient-size"
export * from "./gradient-repeat"
export * from "./gradient-stop-color"
export * from "./gradient-stop-brightness"
export * from "./gradient-stop-opacity"
export * from "./gradient-stop-position"
