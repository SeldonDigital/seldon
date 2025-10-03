export enum ValueType {
  /** Value from a predefined list (Top-left, Underline, Dotted, Helvetica) */
  PRESET = "preset",

  /** Item from an ascending sequence in a theme (@fontSize.small, @fontSize.medium, @fontSize.large, etc) */
  THEME_ORDINAL = "theme.ordinal",

  /** Item from a non-sequential list in a theme (@border.solid, @border.hairline, @border.curly) */
  THEME_CATEGORICAL = "theme.categorical",

  /** Values that don't come from a predefined list (Text, URL, RGB, HSL, PX, REM, Number, etc.) */
  EXACT = "exact",

  /** Value that is based on another value (e.g., when an icon needs to be the same size as a font size) */
  COMPUTED = "computed",

  /** Empty value */
  EMPTY = "empty",

  /** Inherited value */
  INHERIT = "inherit",
}
