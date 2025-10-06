import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getColorCSSValue } from "./get-color-css-value"

describe("getColorCSSValue", () => {
  it("should return correct hex value", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
      theme: testTheme,
    })
    expect(result).toBe("#ff0000")
  })

  it("should return hex value with opacity", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
      opacity: {
        type: ValueType.EXACT,
        value: { value: 50, unit: Unit.PERCENT },
      },
      theme: testTheme,
    })
    expect(result).toBe("#ff0000")
  })

  it("should return correct rgb value", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: { red: 255, green: 0, blue: 0 },
      },
      theme: testTheme,
    })
    expect(result).toBe("rgb(255 0 0)")
  })

  it("should return rgb value with opacity", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: { red: 255, green: 0, blue: 0 },
      },
      opacity: {
        type: ValueType.EXACT,
        value: { value: 50, unit: Unit.PERCENT },
      },
      theme: testTheme,
    })
    expect(result).toBe("rgb(255 0 0 / 50%)")
  })

  it("should return correct hsl value", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: { hue: 0, saturation: 100, lightness: 50 },
      },
      theme: testTheme,
    })
    expect(result).toBe("hsl(0 100% 50%)")
  })

  it("should return hsl value with opacity", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: { hue: 0, saturation: 100, lightness: 50 },
      },
      opacity: {
        type: ValueType.EXACT,
        value: { value: 50, unit: Unit.PERCENT },
      },
      theme: testTheme,
    })
    expect(result).toBe("hsl(0 100% 50% / 50%)")
  })

  it("should return correct lch value", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: { lightness: 50, chroma: 100, hue: 120 },
      },
      theme: testTheme,
    })
    expect(result).toBe("lch(50% 100 120deg)")
  })

  it("should return lch value with opacity", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: { lightness: 50, chroma: 100, hue: 120 },
      },
      opacity: {
        type: ValueType.EXACT,
        value: { value: 50, unit: Unit.PERCENT },
      },
      theme: testTheme,
    })
    expect(result).toBe("lch(50% 100 120deg / 50%)")
  })

  it("should return correct theme color", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      theme: testTheme,
    })
    expect(result).toBe("hsl(0 0% 15%)")
  })

  it("should return theme color with brightness adjustment", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      brightness: {
        type: ValueType.EXACT,
        value: { value: 20, unit: Unit.PERCENT },
      },
      theme: testTheme,
    })
    expect(result).toBe("hsl(0 0% 32%)")
  })

  it("should return empty string for empty color", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EMPTY,
        value: null,
      },
      theme: testTheme,
    })
    expect(result).toBe("")
  })

  it("should handle numeric opacity", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
      opacity: 75,
      theme: testTheme,
    })
    expect(result).toBe("#ff0000")
  })

  it("should handle numeric brightness", () => {
    const result = getColorCSSValue({
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
      brightness: {
        type: ValueType.EXACT,
        value: { value: 10, unit: Unit.PERCENT },
      },
      theme: testTheme,
    })
    expect(result).toBe("hsl(0 100% 55%)")
  })

  it("should throw error for invalid theme color", () => {
    expect(() => {
      getColorCSSValue({
        color: {
          type: ValueType.THEME_CATEGORICAL,
          // @ts-expect-error - invalid theme color
          value: "@swatch.invalid",
        },
        theme: testTheme,
      })
    }).toThrow("Theme value @swatch.invalid not found")
  })
})
