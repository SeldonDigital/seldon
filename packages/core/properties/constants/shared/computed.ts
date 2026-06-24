/** Built-in resolver names stored on computed property values. */
export enum ComputedFunction {
  /** Scale a length or size from a reference value and factor. */
  AUTO_FIT = "autoFit",

  /** Pick a foreground or background color that stays readable on the base color. */
  HIGH_CONTRAST_COLOR = "highContrastColor",

  /** Adjust padding so perceived spacing lines up with the design. */
  OPTICAL_PADDING = "opticalPadding",

  /** Match a color facet to another color in the node's own background chain. */
  MATCH_COLOR = "matchColor",
}

/**
 * Editor label for each `ComputedFunction`. The single source for computed-function display text,
 * read by compute pickers, property formatting, and value stringification.
 */
export const COMPUTED_FUNCTION_DISPLAY_NAMES: Record<ComputedFunction, string> =
  {
    [ComputedFunction.AUTO_FIT]: "Auto Fit",
    [ComputedFunction.HIGH_CONTRAST_COLOR]: "High Contrast",
    [ComputedFunction.OPTICAL_PADDING]: "Optical Padding",
    [ComputedFunction.MATCH_COLOR]: "Match Color",
  }
