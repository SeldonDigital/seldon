import { Value, ValueType } from "@seldon/core"
import { IconId } from "@seldon/core/components/icons"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { Combobox } from "../../../ui/combobox/Combobox"
import { LazyLoadedIcon } from "../../../LazyLoadedIcon"
import { IconTokenValue } from "../../../icons/values/Token"

export interface MenuControlProps {
  value: unknown
  onChange: (value: string) => void
  options:
    | Array<{ value: string; name: string }>
    | Array<Array<{ value: string; name: string }>>
  placeholder: string
  icon: React.ComponentType
  propertyKey?: string
  allowCustom?: boolean
  style?: React.CSSProperties
  disabled?: boolean
}

export function MenuControl({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  propertyKey,
  allowCustom = false,
  style,
  disabled = false,
}: MenuControlProps) {
  // Get the display value - use friendly name from options if available
  const getDisplayValue = (): string => {
    const rawValue = stringifyValue(value as Value | undefined)
    if (!rawValue) return ""

    // For computed values, show the computed function display name
    if (
      value &&
      typeof value === "object" &&
      value !== null &&
      "type" in value &&
      value.type === ValueType.COMPUTED
    ) {
      if (
        "value" in value &&
        value.value &&
        typeof value.value === "object" &&
        "function" in value.value
      ) {
        const functionName = (value.value as Record<string, unknown>).function
        switch (functionName) {
          case "auto_fit":
            return "Auto Fit"
          case "high_contrast_color":
            return "High Contrast Color"
          case "optical_padding":
            return "Optical Padding"
          case "match":
            return "Match"
          default:
            return "Computed"
        }
      }
      return "Computed"
    }

    // For theme values, try to find the friendly name in options
    if (
      value &&
      typeof value === "object" &&
      value !== null &&
      "type" in value &&
      (value.type === ValueType.THEME_ORDINAL ||
        value.type === ValueType.THEME_CATEGORICAL)
    ) {
      // Handle both flat and grouped options
      const flatOptions = Array.isArray(options[0])
        ? (options as Array<Array<{ value: string; name: string }>>).flat()
        : (options as Array<{ value: string; name: string }>)

      const matchingOption = flatOptions.find(
        (option) => option.value === rawValue,
      )
      if (matchingOption) {
        return matchingOption.name
      }
    }

    // For other values, use the raw stringified value
    return rawValue
  }

  return (
    <Combobox
      value={getDisplayValue()}
      placeholder={placeholder}
      validateCustomValue={allowCustom ? () => true : undefined}
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
