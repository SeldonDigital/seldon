import { ValueType } from "@seldon/core"
import {
  HSLObjectToString,
  LCHObjectToString,
  RGBObjectToString,
} from "@seldon/core/helpers/color"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import {
  isHSLObject,
  isLCHObject,
  isRGBObject,
} from "@seldon/core/helpers/type-guards"

/**
 * Returns the wire string used as combobox `value` (option.value), not the display label.
 */
export function getComboboxStoredValue(propertyValue: unknown): string {
  if (
    !propertyValue ||
    typeof propertyValue !== "object" ||
    propertyValue === null
  ) {
    return ""
  }

  // Shorthand and compound values (margin, padding, border, ...) have no
  // top-level `type`. When every set side or facet resolves to the same value,
  // collapse to that representative sub-value so the picker highlights it.
  if (!("type" in propertyValue)) {
    const representative = getRepresentativeSubValue(propertyValue)
    return representative ? getComboboxStoredValue(representative) : ""
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
    case ValueType.EXACT:
      return getExactStoredValue(typed.value)
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

/**
 * Collapses a shorthand or compound value to a single representative sub-value
 * when all present sub-values resolve to the same string. Returns null when the
 * value is empty or mixed (a "Custom" value with no single highlight).
 */
function getRepresentativeSubValue(compound: object): object | null {
  const subValues = Object.values(compound).filter(
    (subValue): subValue is object =>
      typeof subValue === "object" && subValue !== null,
  )
  if (subValues.length === 0) {
    return null
  }

  const strings = subValues.map((subValue) => {
    try {
      return stringifyValue(subValue as never)
    } catch {
      return undefined
    }
  })

  const first = strings[0]
  if (first === undefined) {
    return null
  }
  if (!strings.every((entry) => entry === first)) {
    return null
  }

  return subValues[0]
}

/**
 * Stringifies an EXACT value to the same wire string used by the current-value
 * picker option, so the combobox highlights the active exact value instead of
 * collapsing to the empty "Default" option.
 */
function getExactStoredValue(raw: unknown): string {
  if (raw === null || raw === undefined) {
    return ""
  }

  if (typeof raw === "string") {
    return raw
  }

  if (typeof raw === "number" || typeof raw === "boolean") {
    return String(raw)
  }

  if (typeof raw === "object") {
    if (isHSLObject(raw)) {
      return HSLObjectToString(raw)
    }
    if (isRGBObject(raw)) {
      return RGBObjectToString(raw)
    }
    if (isLCHObject(raw)) {
      return LCHObjectToString(raw)
    }
    if ("value" in raw && "unit" in raw) {
      const dimension = raw as { value: number; unit: string }
      return `${dimension.value}${dimension.unit}`
    }
  }

  return ""
}
