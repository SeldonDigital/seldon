import { describe, expect, it } from "bun:test"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getColorCSSValueFromSwatch } from "./get-color-css-value-from-swatch"

describe("getColorCSSValueFromSwatch", () => {
  it("should return correct value for primary swatch", () => {
    const result = getColorCSSValueFromSwatch({
      swatchKey: "@swatch.primary",
      theme: testTheme,
    })

    expect(result).toBe("hsl(0 0% 15%)")
  })

  it("should return correct value for swatch1", () => {
    const result = getColorCSSValueFromSwatch({
      swatchKey: "@swatch.swatch1",
      theme: testTheme,
    })

    expect(result).toBe("hsl(0 0% 30%)")
  })

  it("should return palette value with opacity", () => {
    const result = getColorCSSValueFromSwatch({
      swatchKey: "@swatch.primary",
      opacity: 75,
      theme: testTheme,
    })

    expect(result).toBe("hsl(0 0% 15% / 75%)")
  })

  it("should handle zero opacity", () => {
    const result = getColorCSSValueFromSwatch({
      swatchKey: "@swatch.primary",
      opacity: 0,
      theme: testTheme,
    })

    expect(result).toBe("hsl(0 0% 15% / 0%)")
  })

  it("should handle null opacity", () => {
    const result = getColorCSSValueFromSwatch({
      swatchKey: "@swatch.primary",
      opacity: null,
      theme: testTheme,
    })

    expect(result).toBe("hsl(0 0% 15%)")
  })

  it("should handle undefined opacity", () => {
    const result = getColorCSSValueFromSwatch({
      swatchKey: "@swatch.primary",
      theme: testTheme,
    })

    expect(result).toBe("hsl(0 0% 15%)")
  })

  it("should handle 100% opacity", () => {
    const result = getColorCSSValueFromSwatch({
      swatchKey: "@swatch.primary",
      opacity: 100,
      theme: testTheme,
    })

    expect(result).toBe("hsl(0 0% 15%)")
  })
})
