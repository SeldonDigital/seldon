/** Shared shape checks for theme token values (unbridged catalog entries). */
import { Unit } from "../../../constants/shared/units"

export function isThemeTokenFiniteNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value)
}

export function isThemeTokenPercentageNumber(value: unknown): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  )
}

export function isThemeTokenBoolean(value: unknown): boolean {
  return typeof value === "boolean"
}

export function isThemeTokenText(value: unknown): boolean {
  return typeof value === "string"
}

export function isThemeTokenColor(value: unknown): boolean {
  return (
    typeof value === "string" ||
    (typeof value === "object" && value !== null && !Array.isArray(value))
  )
}

export function isThemeTokenEnumValue(
  value: unknown,
  options?: ReadonlyArray<{ label: string; value: string | number }>,
): boolean {
  if (!options?.length) return true
  return options.some((option) => option.value === value)
}

/** Raw value for a scale-slot `.value` key: `{ unit: px|rem, value: number }`. */
export function isThemeTokenPxRemLength(value: unknown): boolean {
  if (!value || typeof value !== "object") return false
  if (!("unit" in value) || !("value" in value)) return false
  const u = (value as { unit: unknown }).unit
  const n = (value as { value: unknown }).value
  return (
    (u === Unit.PX || u === Unit.REM) &&
    typeof n === "number" &&
    Number.isFinite(n)
  )
}
