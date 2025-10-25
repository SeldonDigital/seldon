import {
  BorderWidth,
  BorderWidthHairlineValue,
  Corner,
  CornerValue,
  DegreesValue,
  EmptyValue,
  NumberValue,
  PercentageValue,
  PixelValue,
  RemValue,
  Unit,
  ValueType,
} from "@seldon/core"

/**
 * Serializes a given value to a CSS value (string
 * @param value - The value to serialize
 * @returns The CSS value
 */
export function getCssValue(
  value:
    | PixelValue
    | RemValue
    | PercentageValue
    | CornerValue
    | NumberValue
    | BorderWidthHairlineValue
    | DegreesValue
    | EmptyValue,
): string | number {
  switch (value.type) {
    case ValueType.EXACT:
      // Handle plain number values
      if (typeof value.value === "number") {
        return value.value
      }
      // Handle object values with units
      switch (value.value.unit) {
        case Unit.PX:
          return value.value.value + "px"
        case Unit.REM:
          return value.value.value + "rem"
        case Unit.PERCENT:
          return value.value.value + "%"
        case Unit.DEGREES:
          return `rotate(${value.value.value}deg)`
        case Unit.NUMBER:
          return value.value.value
        default:
          // @ts-expect-error
          throw new Error("Invalid exact value with unit " + value.value.unit)
      }

    case ValueType.PRESET: {
      switch (value.value) {
        case BorderWidth.HAIRLINE:
          return "var(--hairline)"
        case Corner.ROUNDED:
          return "99999px"
        case Corner.SQUARED:
          return "0px"
        default:
          // @ts-expect-error
          throw new Error("Invalid preset value " + value.value)
      }
    }

    case ValueType.THEME_ORDINAL: {
      throw new Error(
        `Theme ordinal value "${(value as any).value}" must be resolved first. ` +
          `This function only accepts resolved values (pixels, rems, percentages, or corner presets). ` +
          `Theme values should be resolved by functions like resolveSize(), resolveFontSize(), etc.`,
      )
    }

    case ValueType.EMPTY: {
      return ""
    }

    default: {
      throw new Error(
        `Invalid value type "${(value as any).type}" ${(value as any).value ? `with value "${(value as any).value}"` : ""}. ` +
          `Expected EXACT, PRESET, or EMPTY. Theme values must be resolved before calling getCssValue().`,
      )
    }
  }
}
