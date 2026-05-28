import { ValueType } from "@seldon/core"

/**
 * Returns the wire string used as combobox `value` (option.value), not the display label.
 */
export function getComboboxStoredValue(propertyValue: unknown): string {
  if (
    !propertyValue ||
    typeof propertyValue !== "object" ||
    propertyValue === null ||
    !("type" in propertyValue)
  ) {
    return ""
  }

  const typed = propertyValue as { type: ValueType; value?: unknown }

  switch (typed.type) {
    case ValueType.EMPTY:
      return ""
    case ValueType.INHERIT:
      return "inherit"
    case ValueType.THEME_CATEGORICAL:
    case ValueType.THEME_ORDINAL:
    case ValueType.OPTION:
      return typed.value != null ? String(typed.value) : ""
    case ValueType.COMPUTED:
      if (
        typed.value &&
        typeof typed.value === "object" &&
        "function" in typed.value
      ) {
        return String((typed.value as { function: string }).function)
      }
      return ""
    default:
      return ""
  }
}
