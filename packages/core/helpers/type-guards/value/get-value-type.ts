import { ValueType } from "../../../properties"
import { parseThemeRef } from "../../theme/get-theme-key-components"

/**
 * Determines the appropriate ValueType for a theme value string
 *
 * @param value - The value string to analyze
 * @returns The appropriate ValueType (THEME_CATEGORICAL, THEME_ORDINAL, or OPTION)
 */
export function getValueType(value: string): ValueType {
  const ref = parseThemeRef(value)
  if (!ref) {
    return ValueType.OPTION
  }

  switch (ref.section) {
    case "border":
    case "swatch":
    case "shadow":
    case "gradient":
    case "background":
    case "color":
    case "fontFamily":
    case "font":
      return ValueType.THEME_CATEGORICAL

    case "borderWidth":
    case "blur":
    case "corners":
    case "fontSize":
    case "fontWeight":
    case "lineHeight":
    case "size":
    case "margin":
    case "padding":
    case "gap":
    case "dimension":
    case "spread":
      return ValueType.THEME_ORDINAL

    default:
      return ValueType.OPTION
  }
}
