/** Suffix on exact numeric values so resolution and export pick the right CSS or raw form. */
export enum Unit {
  /** Length in pixels. */
  PX = "px",

  /** Length relative to the root font size. */
  REM = "rem",

  /** Fraction of a reference size or an amount from zero through one hundred. */
  PERCENT = "%",

  /** Rotation angle. */
  DEGREES = "deg",

  /** Unitless count or ratio with no CSS suffix. */
  NUMBER = "number",
}
