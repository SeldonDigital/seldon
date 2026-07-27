/**
 * Suffix on exact numeric values so resolution and export pick the right CSS or raw form. `PX` is a
 * length in pixels and `REM` is a length relative to the root font size. `PERCENT` is a fraction of
 * a reference size or an amount from zero through one hundred. `DEGREES` is a rotation angle.
 * `NUMBER` is a unitless count or ratio with no CSS suffix.
 */
export enum Unit {
  PX = "px",
  REM = "rem",
  PERCENT = "%",
  DEGREES = "deg",
  NUMBER = "number",
}
