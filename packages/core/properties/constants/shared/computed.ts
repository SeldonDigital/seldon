/** Built-in resolver names stored on computed property values. */
export enum ComputedFunction {
  /** Scale a length or size from a reference value and factor. */
  AUTO_FIT = "autoFit",

  /** Pick a foreground or background color that stays readable on the base color. */
  HIGH_CONTRAST_COLOR = "highContrastColor",

  /** Adjust padding so perceived spacing lines up with the design. */
  OPTICAL_PADDING = "opticalPadding",

  /** Reuse the resolved value from another property path. */
  MATCH = "match",
}
