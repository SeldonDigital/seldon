/**
 * Compound value types - properties with different type sub-properties (background, font, border)
 */
import {
  BackgroundValue,
  BorderValue,
  FontValue,
  GradientValue,
  ShadowValue,
} from "../values"

export type CompoundValue =
  // APPEARANCE
  | BackgroundValue // Background (color, image, position, size, repeat) - compound
  | BorderValue // Border (width, style, color, opacity) - compound

  // TYPOGRAPHY
  | FontValue // Font (family, size, weight, style, lineHeight) - compound

  // GRADIENTS
  | GradientValue // Gradient (type, angle, stops) - compound

  // EFFECTS
  | ShadowValue // Shadow (offset, blur, spread, color, opacity) - compound
