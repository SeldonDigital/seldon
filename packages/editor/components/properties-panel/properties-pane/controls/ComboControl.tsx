import { Value } from "@seldon/core"
import { IconId } from "@seldon/core/components/icons"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { Combobox } from "../../../ui/combobox/Combobox"
import { LazyLoadedIcon } from "../../../LazyLoadedIcon"
import { IconTokenValue } from "../../../icons/values/Token"

export interface ComboControlProps {
  value: unknown
  onChange: (value: string) => void
  options:
    | Array<{ value: string; name: string }>
    | Array<Array<{ value: string; name: string }>>
  placeholder: string
  icon: React.ComponentType
  propertyKey?: string
  allowCustom?: boolean
  customValidation?: (value: string) => boolean
  units?: string[]
  useCompoundPlaceholder?: boolean
  style?: React.CSSProperties
  disabled?: boolean
}

export function ComboControl({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  propertyKey,
  allowCustom = true,
  customValidation,
  units = [],
  useCompoundPlaceholder = false,
  style,
  disabled = false,
}: ComboControlProps) {
  const getValidationFunction = () => {
    if (customValidation) {
      return customValidation
    }

    if (units.length > 0) {
      // Basic validation for values with units
      return (value: string) => {
        if (isThemeValueKey(value)) return true
        return (
          units.some((unit) => value.endsWith(unit)) || !isNaN(Number(value))
        )
      }
    }

    return () => true
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
    // Don't add units to placeholder if this property uses compound placeholders
    if (useCompoundPlaceholder) {
      return placeholder
    }
    // Don't add units to empty/unset placeholders (None, Auto, etc.)
    if (isEmptyOrUnsetPlaceholder(placeholder)) {
      return placeholder
    }
    if (units.length > 0) {
      return `${placeholder} (${units.join(", ")})`
    }
    return placeholder
  }

  // Get the raw value for the Combobox (Combobox will handle the display name lookup)
  const getRawValue = (): string => {
    return stringifyValue(value as Value | undefined) || ""
  }

  return (
    <Combobox
      value={getRawValue()}
      placeholder={formatPlaceholder()}
      validateCustomValue={allowCustom ? getValidationFunction() : undefined}
      renderIcon={renderIcon}
      options={options}
      onValueChange={onChange}
      style={style}
      disabled={disabled}
    />
  )

  function renderIcon(option: { value: string; name: string } | undefined) {
    if (option && isThemeValueKey(option.value)) {
      return <IconTokenValue />
    }

    // For icon properties, render the actual icon
    if (propertyKey === "symbol" && option) {
      return <LazyLoadedIcon iconId={option.value as IconId} />
    }

    return <Icon />
  }
}
