import { LCH } from "../../index"

/**
 * Converts an LCH object to an LCH string with optional opacity.
 *
 * @param lch - The LCH object to convert
 * @param opacity - The opacity percentage (0-100) or null for no opacity (default: 100)
 * @returns An LCH string (e.g., "lch(50% 100 120deg)" or "lch(50% 100 120deg / 80%)")
 */
export function LCHObjectToString(lch: LCH, opacity: number | null = 100) {
  return opacity === 100 || opacity === null
    ? `lch(${lch.lightness}% ${lch.chroma} ${lch.hue}deg)`
    : `lch(${lch.lightness}% ${lch.chroma} ${lch.hue}deg / ${opacity}%)`
}
