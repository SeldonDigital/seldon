import type { HSL } from "./hsl"
import type { LCH } from "./lch"
import type { RGB } from "./rgb"

/**
 * Literal color where `ValueType` is absent: theme `baseColor` / static swatch `value`,
 * and the same shapes used inside property EXACT color `value` (hex string, HSL/RGB/LCH objects).
 */
export type ColorSpaceLiteral = HSL | RGB | LCH | string
