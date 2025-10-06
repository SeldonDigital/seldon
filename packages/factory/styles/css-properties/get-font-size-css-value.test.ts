import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getFontSizeCSSValue } from "./get-font-size-css-value"

describe("getFontSizeCSSValue", () => {
  it("should return correct pixel value", () => {
    const result = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.EXACT,
        value: { value: 16, unit: Unit.PX },
      },
      theme: testTheme,
    })
    expect(result).toBe("16px")
  })

  it("should return correct rem value", () => {
    const result = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.EXACT,
        value: { value: 1.5, unit: Unit.REM },
      },
      theme: testTheme,
    })
    expect(result).toBe("1.5rem")
  })

  it("should return correct theme value", () => {
    const result = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.THEME_ORDINAL,
        value: "@fontSize.medium",
      },
      theme: testTheme,
    })

    expect(result).toBe("1rem")
  })

  it("should handle decimal values for pixel", () => {
    const result = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.EXACT,
        value: { value: 14.5, unit: Unit.PX },
      },
      theme: testTheme,
    })
    expect(result).toBe("14.5px")
  })

  it("should handle decimal values for rem", () => {
    const result = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.EXACT,
        value: { value: 0.875, unit: Unit.REM },
      },
      theme: testTheme,
    })
    expect(result).toBe("0.875rem")
  })

  it("should throw error for invalid theme value", () => {
    expect(() =>
      getFontSizeCSSValue({
        fontSize: {
          type: ValueType.THEME_ORDINAL,
          // @ts-expect-error - Testing invalid theme value
          value: "@fontSize.invalid",
        },
        theme: testTheme,
      }),
    ).toThrow("Theme value @fontSize.invalid not found")
  })

  it("should handle zero values", () => {
    const resultPx = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.EXACT,
        value: { value: 0, unit: Unit.PX },
      },
      theme: testTheme,
    })
    expect(resultPx).toBe("0px")

    const resultRem = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.EXACT,
        value: { value: 0, unit: Unit.REM },
      },
      theme: testTheme,
    })
    expect(resultRem).toBe("0rem")
  })

  it("should handle different theme font size values", () => {
    const testCases = [
      { value: "@fontSize.small" as const, expected: "0.875rem" },
      { value: "@fontSize.medium" as const, expected: "1rem" },
      { value: "@fontSize.large" as const, expected: "1.501rem" },
    ]

    testCases.forEach(({ value, expected }) => {
      const result = getFontSizeCSSValue({
        fontSize: {
          type: ValueType.THEME_ORDINAL,
          value,
        },
        theme: testTheme,
      })

      expect(result).toBe(expected)
    })
  })

  it("should handle negative values", () => {
    const resultPx = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.EXACT,
        value: { value: -10, unit: Unit.PX },
      },
      theme: testTheme,
    })
    expect(resultPx).toBe("-10px")

    const resultRem = getFontSizeCSSValue({
      fontSize: {
        type: ValueType.EXACT,
        value: { value: -0.5, unit: Unit.REM },
      },
      theme: testTheme,
    })
    expect(resultRem).toBe("-0.5rem")
  })
})
