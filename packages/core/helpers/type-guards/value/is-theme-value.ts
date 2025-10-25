import { ValueType } from "../../../properties"
import { Value } from "../../../properties/types/value"
import { ThemeValue } from "../../../properties/types/value-theme"
import { isCompoundValue } from "../compound/is-compound-value"

/**
 * Type guard that checks if a value is a theme value (categorical or ordinal).
 * @param value - The property value to check
 * @returns True if the value is a ThemeValue type
 */
export function isThemeValue(value: Value): value is ThemeValue {
  if (isCompoundValue(value)) return false
  if (!value || typeof value !== "object" || !("type" in value)) return false

  return (
    value.type === ValueType.THEME_CATEGORICAL ||
    value.type === ValueType.THEME_ORDINAL
  )
}
