import { Unit } from "../../properties/constants/shared/units"
import type { ThemeExactDimension } from "../values/shared/exact/theme-exact"

/**
 * Normalizes a theme value by extracting the number from unit objects.
 * Uses type definitions as the source of truth - if a value should be a number,
 * extract it from unit objects, otherwise return as-is.
 *
 * @param value - The value to normalize (could be number or unit object)
 * @returns Normalized number value
 */
export function normalizeThemeNumber(value: unknown): number {
  // If it's already a number, return it
  if (typeof value === "number") {
    return value
  }

  // If it's a unit object, extract the value
  if (
    value &&
    typeof value === "object" &&
    "unit" in value &&
    "value" in value &&
    typeof (value as { value: unknown }).value === "number"
  ) {
    return (value as { value: number }).value
  }

  // Fallback: try to parse as number
  if (typeof value === "string") {
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) {
      return parsed
    }
  }

  // If we can't normalize, throw an error
  throw new Error(
    `Cannot normalize theme value to number: ${JSON.stringify(value)}`,
  )
}

/**
 * Normalizes a length scale-slot value (`size` / `dimension` / `margin` / `padding` / `gap` /
 * `corners` / `fontSize` / `blur` / `spread`). Accepts only `{ unit: "px"|"rem", value: number }`.
 * Other EXACT subsets (`number`, `%`, `deg`) are validated by their own normalizers / schemas.
 */
export function normalizeThemeExactValue(value: unknown): ThemeExactDimension {
  if (
    !value ||
    typeof value !== "object" ||
    !("unit" in value) ||
    !("value" in value)
  ) {
    throw new Error(
      `Theme length scale-slot value must be { unit: "px"|"rem", value: number }: ${JSON.stringify(value)}`,
    )
  }
  const { unit, value: n } = value as { unit: unknown; value: unknown }
  if (unit !== Unit.PX && unit !== Unit.REM) {
    throw new Error(
      `Theme length scale-slot unit must be px or rem, got ${JSON.stringify(unit)}`,
    )
  }
  if (typeof n !== "number" || !Number.isFinite(n)) {
    throw new Error(
      `Theme length scale-slot numeric value must be finite, got ${JSON.stringify(n)}`,
    )
  }
  return { unit, value: n }
}
