import { Value } from "@seldon/core"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { isValidURL } from "@seldon/core/helpers/validation/url"
import { Input } from "../../../ui/Input"

export interface TextControlProps {
  value: unknown
  onChange: (value: string) => void
  placeholder: string
  icon: React.ComponentType
  validation?:
    | "url"
    | "text"
    | "number"
    | "percentage"
    | "both"
    | ((value: string) => boolean)
  maxLength?: number
  style?: React.CSSProperties
  disabled?: boolean
}

export function TextControl({
  value,
  onChange,
  placeholder,
  icon: Icon,
  validation = "text",
  maxLength,
  style,
  disabled = false,
}: TextControlProps) {
  const getValidationFunction = () => {
    if (typeof validation === "function") {
      return validation
    }

    switch (validation) {
      case "url":
        return (value: string) => isValidURL(value)
      case "text":
      default:
        return () => true
    }
  }

  return (
    <Input
      value={stringifyValue(value as Value | undefined)}
      placeholder={placeholder}
      iconLeft={<Icon />}
      onValueChange={onChange}
      validate={getValidationFunction()}
      maxLength={maxLength}
      style={style}
      disabled={disabled}
    />
  )
}
