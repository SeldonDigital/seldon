import type { Theme } from "../../../themes/types"
import { getPropertySchema } from "./get-property-schema"

/**
 * Runs the schema validator for one storage shape.
 *
 * @param propertyName Flattened property map key, for example `color` or `borderWidth`.
 * @param valueType {@link PropertyValueType} string such as `exact` or `themeCategorical`, not the `ValueType` wire string for theme-backed property values.
 * @param value Raw payload to validate, without the wrapping `{ type, value }` object.
 * @param theme Required for `themeCategorical` and `themeOrdinal` when the validator reads the theme object.
 */
export function validatePropertyValue(
  propertyName: string,
  valueType: string,
  value: unknown,
  theme?: Theme,
): boolean {
  const schema = getPropertySchema(propertyName)
  if (!schema) return false

  const validator =
    schema.validation[valueType as keyof typeof schema.validation]
  if (!validator) return false

  return validator(value, theme)
}
