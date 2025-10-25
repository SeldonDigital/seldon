import { Value } from "@seldon/core"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import {
  isNumber,
  isPercentage,
  isPx,
  isRem,
} from "@seldon/core/helpers/validation"
import { Input } from "../../../ui/Input"

export interface NumberControlProps {
  value: unknown
  onChange: (value: string) => void
  placeholder: string
  icon: React.ComponentType
  validation?:
    | "number"
    | "percentage"
    | "both"
    | "text"
    | "url"
    | ((value: string) => boolean)
  min?: number
  max?: number
  units?: string[]
  style?: React.CSSProperties
  disabled?: boolean
}

export function NumberControl({
  value,
  onChange,
  placeholder,
  icon: Icon,
  validation = "both",
  min,
  max,
  units = [],
  style,
  disabled = false,
}: NumberControlProps) {
  const getValidationFunction = () => {
    if (typeof validation === "function") {
      return validation
    }

    switch (validation) {
      case "number":
        // For pure numbers, accept both unitless numbers and numbers with valid units
        return (value: string) => {
          // Accept unitless numbers
          if (isNumber(value, { min, max })) return true

          // Accept numbers with valid units for this property
          if (units.length > 0) {
            return units.some((unit) => {
              if (unit === "px" && isPx(value)) return true
              if (unit === "rem" && isRem(value)) return true
              if (unit === "%" && isPercentage(value, { min, max })) return true
              if (
                unit === "deg" &&
                value.toLowerCase().endsWith("deg") &&
                !isNaN(parseFloat(value))
              )
                return true
              return false
            })
          }

          return false
        }
      case "percentage":
        // For percentage properties, accept both unitless numbers and percentages
        return (value: string) => {
          // Accept unitless numbers (will get % appended)
          if (isNumber(value, { min, max })) return true
          // Accept percentages
          if (isPercentage(value, { min, max })) return true
          return false
        }
      case "both":
      default:
        // Accept unitless numbers and numbers with any valid units
        return (value: string) => {
          // Accept unitless numbers
          if (isNumber(value, { min, max })) return true
          // Accept percentages
          if (isPercentage(value, { min, max })) return true
          // Accept other units if specified
          if (units.length > 0) {
            return units.some((unit) => {
              if (unit === "px" && isPx(value)) return true
              if (unit === "rem" && isRem(value)) return true
              if (
                unit === "deg" &&
                value.toLowerCase().endsWith("deg") &&
                !isNaN(parseFloat(value))
              )
                return true
              return false
            })
          }
          return false
        }
    }
  }

  /**
   * Check if a placeholder represents an empty or unset state
   * This is dynamic and not hardcoded to specific text
   */
  const isEmptyOrUnsetPlaceholder = (placeholder: string): boolean => {
    const lowerPlaceholder = placeholder.toLowerCase()

    // Common empty/unset placeholder patterns
    const emptyPatterns = [
      "none",
      "auto",
      "inherit",
      "initial",
      "unset",
      "default",
      "empty",
      "blank",
      "null",
      "undefined",
      "clear",
      "reset",
    ]

    // Check if placeholder matches any empty pattern
    return emptyPatterns.some((pattern) => lowerPlaceholder === pattern)
  }

  const formatPlaceholder = () => {
    // Don't add units to empty/unset placeholders (None, Auto, etc.)
    if (isEmptyOrUnsetPlaceholder(placeholder)) {
      return placeholder
    }
    // Don't add units to placeholders that already contain the same units
    if (units.length > 0) {
      const placeholderHasUnits = units.some((unit) =>
        placeholder.includes(unit),
      )
      if (placeholderHasUnits) {
        return placeholder
      }
      return `${placeholder} (${units.join(", ")})`
    }
    return placeholder
  }

  return (
    <Input
      value={stringifyValue(value as Value | undefined)}
      placeholder={formatPlaceholder()}
      iconLeft={<Icon />}
      onValueChange={onChange}
      validate={getValidationFunction()}
      style={style}
      disabled={disabled}
    />
  )
}
