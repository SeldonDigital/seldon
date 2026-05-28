import type { HSL } from "../../../../properties/values/shared/exact/hsl"
import type { LCH } from "../../../../properties/values/shared/exact/lch"
import type { RGB } from "../../../../properties/values/shared/exact/rgb"
import { Colorspace } from "../../../constants/colorspace"

/**
 * Discriminated `parameters` payload for `TokenType.SWATCH` cells. Mirrors the EXACT
 * `{ unit, value }` shape, with `colorspace` as the discriminator.
 *
 * - `hsl` / `rgb` / `lch`: structured channel objects.
 * - `hex`: `#rgb`, `#rgba`, `#rrggbb`, or `#rrggbbaa`.
 * - `name`: a CSS named color (`"rebeccapurple"`, `"tomato"`, …).
 */
export type ThemeSwatchParameters =
  | { colorspace: Colorspace.HSL; value: HSL }
  | { colorspace: Colorspace.RGB; value: RGB }
  | { colorspace: Colorspace.LCH; value: LCH }
  | { colorspace: Colorspace.HEX; value: string }
  | { colorspace: Colorspace.NAME; value: string }
