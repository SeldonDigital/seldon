/**
 * Built-in resolver names stored on computed property values. `AUTO_FIT` scales a length or size
 * from a reference value and factor. `HIGH_CONTRAST_COLOR` picks a foreground or background color
 * that stays readable on the base color. `OPTICAL_PADDING` adjusts padding so perceived spacing
 * lines up with the design. `MATCH_COLOR` matches a color facet to another color in the node's own
 * background chain.
 */
export enum ComputedFunction {
  AUTO_FIT = "autoFit",
  HIGH_CONTRAST_COLOR = "highContrastColor",
  OPTICAL_PADDING = "opticalPadding",
  MATCH_COLOR = "matchColor",
}

/**
 * Editor label for each `ComputedFunction`. The single source for computed-function display text,
 * read by compute pickers, property formatting, and value stringification.
 */
export const COMPUTED_FUNCTION_DISPLAY_NAMES: Record<ComputedFunction, string> = {
  [ComputedFunction.AUTO_FIT]: "Auto Fit",
  [ComputedFunction.HIGH_CONTRAST_COLOR]: "High Contrast",
  [ComputedFunction.OPTICAL_PADDING]: "Optical Padding",
  [ComputedFunction.MATCH_COLOR]: "Match Color",
}
