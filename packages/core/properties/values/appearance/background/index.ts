import type { GradientValue } from "../../effects/gradients/gradient"
import type { GradientAngleValue } from "../../effects/gradients/gradient-angle"
import type { GradientPositionValue } from "../../effects/gradients/gradient-position"
import type { GradientRepeatValue } from "../../effects/gradients/gradient-repeat"
import type { GradientShapeValue } from "../../effects/gradients/gradient-shape"
import type { GradientSizeValue } from "../../effects/gradients/gradient-size"
import type { GradientStopBrightnessValue } from "../../effects/gradients/gradient-stop-brightness"
import type { GradientStopColorValue } from "../../effects/gradients/gradient-stop-color"
import type { GradientStopOpacityValue } from "../../effects/gradients/gradient-stop-opacity"
import type { GradientStopPositionValue } from "../../effects/gradients/gradient-stop-position"
import { EmptyValue } from "../../shared/empty/empty"
import { BackgroundBlendModeValue } from "./background-blend-mode"
import { BackgroundBrightnessValue } from "./background-brightness"
import { BackgroundColorValue } from "./background-color"
import { BackgroundFilterValue } from "./background-filter"
import { BackgroundImageValue } from "./background-image"
import { BackgroundKindValue } from "./background-kind"
import { BackgroundOpacityValue } from "./background-opacity"
import { BackgroundPositionValue } from "./background-position"
import { BackgroundRepeatValue } from "./background-repeat"
import { BackgroundSizeValue } from "./background-size"

/**
 * One layer in the background stack. `kind` selects which facets apply:
 *
 * - `color` uses `color`, `brightness`, `opacity`.
 * - `image` uses `image`, `blendMode`, `position`, `size`, `repeat`, `filter`.
 * - `linearGradient` uses `preset`, `angle`, and the gradient stop facets.
 * - `radialGradient` uses `preset`, `positionX`, `positionY`, `shape`,
 *   `radialSize`, and the gradient stop facets.
 * - `conicGradient` uses `preset`, `angle`, `conicRepeat`, and the gradient
 *   stop facets.
 */
export interface BackgroundLayer {
  kind?: BackgroundKindValue | EmptyValue
  image?: BackgroundImageValue | EmptyValue
  position?: BackgroundPositionValue | EmptyValue
  size?: BackgroundSizeValue | EmptyValue
  repeat?: BackgroundRepeatValue | EmptyValue
  color?: BackgroundColorValue | EmptyValue
  blendMode?: BackgroundBlendModeValue | EmptyValue
  filter?: BackgroundFilterValue | EmptyValue
  brightness?: BackgroundBrightnessValue | EmptyValue
  opacity?: BackgroundOpacityValue | EmptyValue
  preset?: GradientValue | EmptyValue
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

export * from "./background-kind"
export * from "./background-image"
export * from "./background-position"
export * from "./background-size"
export * from "./background-repeat"
export * from "./background-color"
export * from "./background-blend-mode"
export * from "./background-filter"
export * from "./background-brightness"
export * from "./background-opacity"
export * from "./background-seeds"
