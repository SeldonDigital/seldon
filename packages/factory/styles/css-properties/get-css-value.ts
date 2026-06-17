import {
  assertNever,
  BorderWidth,
  BorderWidthHairlineValue,
  Color,
  Corner,
  CornerValue,
  DegreesValue,
  EmptyValue,
  Margin,
  MarginSideOptionValue,
  NumberValue,
  Padding,
  PaddingSideOptionValue,
  PercentageValue,
  PixelValue,
  RemValue,
  TransparentValue,
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
    | TransparentValue
    | MarginSideOptionValue
    | PaddingSideOptionValue
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
          return assertNever(value.value)
      }

    case ValueType.OPTION: {
      switch (value.value) {
        case BorderWidth.HAIRLINE:
          return "var(--hairline)"
        case Corner.ROUNDED:
          return "99999px"
        case Corner.SQUARED:
          return "0px"
        // Margin.NONE and Padding.NONE share the "none" value; unitless 0 zeros any unit.
        case Margin.NONE:
        case Padding.NONE:
          return "0"
        case Color.TRANSPARENT:
          return "transparent"
        default:
          return assertNever(value)
      }
    }

    case ValueType.THEME_ORDINAL: {
      throw new Error(
        `Theme ordinal value "${(value as { value: unknown }).value}" must be resolved first. ` +
          `This function only accepts resolved values (pixels, rems, percentages, or corner presets). ` +
          `Theme values should be resolved by functions like resolveSize(), resolveFontSize(), etc.`,
      )
    }

    case ValueType.EMPTY: {
      return ""
    }

    default: {
      const invalidValue = value as { type?: unknown; value?: unknown }
      throw new Error(
        `Invalid value type "${invalidValue.type}" ${invalidValue.value ? `with value "${invalidValue.value}"` : ""}. ` +
          `Expected EXACT, OPTION, or EMPTY. Theme values must be resolved before calling getCssValue().`,
      )
    }
  }
}
