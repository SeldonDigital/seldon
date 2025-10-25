/**
 * Shorthand value types - properties with same type sub-properties (margin, padding, corners)
 */
import {
  CornersValue,
  MarginValue,
  PaddingValue,
  PositionValue,
} from "../values"

export type ShorthandValue =
  // LAYOUT
  | MarginValue // Margin (top, right, bottom, left) - layout shorthand
  | PaddingValue // Padding (top, right, bottom, left) - layout shorthand
  | PositionValue // Position (top, right, bottom, left) - layout shorthand

  // APPEARANCE
  | CornersValue // Border radius (topLeft, topRight, bottomLeft, bottomRight) - appearance shorthand
