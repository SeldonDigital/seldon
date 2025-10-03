import { ValueType } from "../../../properties/constants/value-types"

/**
 * Determines the appropriate ValueType for a theme value string
 *
 * @param value - The value string to analyze
 * @returns The appropriate ValueType (THEME_CATEGORICAL, THEME_ORDINAL, or PRESET)
 */
export function getValueType(value: string): ValueType {
  if (!value.startsWith("@")) {
    return ValueType.PRESET
  }

  const themeSection = value.split(".")[0] as `@${string}`
  switch (themeSection) {
    case "@border":
    case "@swatch":
    case "@shadow":
    case "@gradient":
    case "@background":
    case "@color":
    case "@fontFamily":
    case "@font":
      return ValueType.THEME_CATEGORICAL

    case "@borderWidth":
    case "@blur":
    case "@corners":
    case "@fontSize":
    case "@fontWeight":
    case "@lineHeight":
    case "@size":
    case "@margin":
    case "@padding":
    case "@gap":
    case "@dimension":
    case "@spread":
      return ValueType.THEME_ORDINAL

    default:
      return ValueType.PRESET
  }
}
