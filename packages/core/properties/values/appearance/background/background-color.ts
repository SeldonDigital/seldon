import { ColorValue } from "../../color/color"
import { ComputedHighContrastValue } from "../../computed/high-contrast-color"

/**
 * Background color value type excluding computed colors.
 */
export type BackgroundColorValue = Exclude<
  ColorValue,
  ComputedHighContrastValue
>
