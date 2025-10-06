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
        "Theme values must be resolved first. This function only accepts pixels, rems, percentages or corner values",
      )
    }

    case ValueType.EMPTY: {
      return ""
    }

    default: {
      // @ts-expect-error
      throw new Error("Invalid value type " + value.type)
    }
  }
}
