import { describe, expect, it } from "bun:test"
import { BorderWidth, Corner, Unit, ValueType } from "@seldon/core"
import { getCssValue } from "./get-css-value"

describe("getCssValue", () => {
  it("should convert pixel values to CSS", () => {
    const result = getCssValue({
      type: ValueType.EXACT,
      value: { value: 16, unit: Unit.PX },
    })

    expect(result).toBe("16px")
  })

  it("should convert rem values to CSS", () => {
    const result = getCssValue({
      type: ValueType.EXACT,
      value: { value: 1.5, unit: Unit.REM },
    })

    expect(result).toBe("1.5rem")
  })

  it("should convert percentage values to CSS", () => {
    const result = getCssValue({
      type: ValueType.EXACT,
      value: { value: 50, unit: Unit.PERCENT },
    })

    expect(result).toBe("50%")
  })

  it("should convert rounded corner values to CSS", () => {
    const result = getCssValue({
      type: ValueType.PRESET,
      value: Corner.ROUNDED,
    })

    expect(result).toBe("99999px")
  })

  it("should convert degree values to CSS", () => {
    const result = getCssValue({
      type: ValueType.EXACT,
      value: { value: 90, unit: Unit.DEGREES },
    })

    expect(result).toBe("rotate(90deg)")
  })

  it("should convert hairline values to CSS", () => {
    const result = getCssValue({
      type: ValueType.PRESET,
      value: BorderWidth.HAIRLINE,
    })

    expect(result).toBe("var(--hairline)")
  })

  it("should throw error for theme values", () => {
    expect(() =>
      getCssValue({
        type: ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      }),
    ).toThrow("Theme values must be resolved first")
  })

  it("should throw error for invalid value types", () => {
    expect(() =>
      getCssValue({
        // @ts-expect-error
        type: ValueType.THEME_CATEGORICAL,
        value: "@corners.tight",
      }),
    ).toThrow("Invalid value type theme.categorical")
  })
})
