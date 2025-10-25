import { describe, expect, it } from "bun:test"
import { ValueType } from "../../index"
import { Color } from "../../properties"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import { HexValue } from "../../properties/values/shared/hex"
import { HSLValue } from "../../properties/values/shared/hsl"
import { LCHValue } from "../../properties/values/shared/lch"
import { RGBValue } from "../../properties/values/shared/rgb"
import { ColorThemeValue } from "../../properties/values/shared/theme"
import { TransparentValue } from "../../properties/values/shared/transparent"
import { getContrastRatio, isDarkBackgroundColor } from "./contrast"

describe("isDarkBackgroundColor", () => {
  it("should return true for dark colors", () => {
    const darkColor: HexValue = {
      type: ValueType.EXACT,
      value: "#000000",
    }

    expect(isDarkBackgroundColor(darkColor)).toBe(true)
  })

  it("should return false for light colors", () => {
    const lightColor: HexValue = {
      type: ValueType.EXACT,
      value: "#ffffff",
    }

    expect(isDarkBackgroundColor(lightColor)).toBe(false)
  })

  it("should return true for dark RGB colors", () => {
    const darkRgbColor: RGBValue = {
      type: ValueType.EXACT,
      value: { red: 0, green: 0, blue: 0 },
    }

    expect(isDarkBackgroundColor(darkRgbColor)).toBe(true)
  })

  it("should return false for light RGB colors", () => {
    const lightRgbColor: RGBValue = {
      type: ValueType.EXACT,
      value: { red: 255, green: 255, blue: 255 },
    }

    expect(isDarkBackgroundColor(lightRgbColor)).toBe(false)
  })

  it("should return true for dark HSL colors", () => {
    const darkHslColor: HSLValue = {
      type: ValueType.EXACT,
      value: { hue: 0, saturation: 0, lightness: 0 },
    }

    expect(isDarkBackgroundColor(darkHslColor)).toBe(true)
  })

  it("should return false for light HSL colors", () => {
    const lightHslColor: HSLValue = {
      type: ValueType.EXACT,
      value: { hue: 0, saturation: 0, lightness: 100 },
    }

    expect(isDarkBackgroundColor(lightHslColor)).toBe(false)
  })

  it("should return true for dark LCH colors", () => {
    const darkLchColor: LCHValue = {
      type: ValueType.EXACT,
      value: { lightness: 0, chroma: 0, hue: 0 },
    }

    expect(isDarkBackgroundColor(darkLchColor)).toBe(true)
  })

  it("should return false for light LCH colors", () => {
    const lightLchColor: LCHValue = {
      type: ValueType.EXACT,
      value: { lightness: 100, chroma: 0, hue: 0 },
    }

    expect(isDarkBackgroundColor(lightLchColor)).toBe(false)
  })

  it("should throw error for transparent color", () => {
    const transparentColor: TransparentValue = {
      type: ValueType.PRESET,
      value: Color.TRANSPARENT,
    }

    expect(() => {
      isDarkBackgroundColor(transparentColor)
    }).toThrow(/transparent/i)
  })

  it("should throw error for empty color", () => {
    const emptyColor: EmptyValue = {
      type: ValueType.EMPTY,
      value: null,
    }

    expect(() => {
      isDarkBackgroundColor(emptyColor)
    }).toThrow(/empty/i)
  })

  it("should use custom threshold", () => {
    const mediumColor: HexValue = {
      type: ValueType.EXACT,
      value: "#808080", // Medium gray
    }

    // With default threshold (2.5), this should be considered dark (contrast ratio ~3.95)
    expect(isDarkBackgroundColor(mediumColor)).toBe(true)

    // With lower threshold (1.0), this should be considered dark
    expect(isDarkBackgroundColor(mediumColor, 1.0)).toBe(true)
  })

  it("should return false for light color with high threshold", () => {
    const lightColor: HexValue = {
      type: ValueType.EXACT,
      value: "#ffffff", // White
    }

    expect(isDarkBackgroundColor(lightColor, 5.0)).toBe(false)
  })

  it("should return true for dark color with low threshold", () => {
    const darkColor: HexValue = {
      type: ValueType.EXACT,
      value: "#000000", // Black
    }

    expect(isDarkBackgroundColor(darkColor, 1.0)).toBe(true)
  })

  it("should throw error for theme colors", () => {
    const themeColor: ColorThemeValue = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    }

    expect(() => {
      isDarkBackgroundColor(themeColor)
    }).toThrow(/theme.*convert/i)
  })
})

describe("getContrastRatio", () => {
  it("should return high contrast ratio for black and white", () => {
    const blackColor: HexValue = {
      type: ValueType.EXACT,
      value: "#000000",
    }

    const ratio = getContrastRatio(blackColor)
    expect(ratio).toBeGreaterThan(20) // Black vs white has ~21:1 contrast
  })

  it("should return exact contrast ratio for white", () => {
    const whiteColor: HexValue = {
      type: ValueType.EXACT,
      value: "#ffffff",
    }

    const ratio = getContrastRatio(whiteColor)
    expect(ratio).toBe(1) // White vs white has 1:1 contrast
  })

  it("should return low contrast ratio for similar colors", () => {
    const grayColor: HexValue = {
      type: ValueType.EXACT,
      value: "#808080",
    }

    const ratio = getContrastRatio(grayColor)
    expect(ratio).toBeLessThan(5) // Gray vs white has low contrast
  })

  it("should work with RGB colors", () => {
    const redColor: RGBValue = {
      type: ValueType.EXACT,
      value: { red: 255, green: 0, blue: 0 },
    }

    const ratio = getContrastRatio(redColor)
    expect(ratio).toBeGreaterThan(0)
    expect(ratio).toBeLessThan(10)
  })

  it("should work with HSL colors", () => {
    const blueColor: HSLValue = {
      type: ValueType.EXACT,
      value: { hue: 240, saturation: 100, lightness: 50 },
    }

    const ratio = getContrastRatio(blueColor)
    expect(ratio).toBeGreaterThan(0)
    expect(ratio).toBeLessThan(10)
  })

  it("should work with LCH colors", () => {
    const greenColor: LCHValue = {
      type: ValueType.EXACT,
      value: { lightness: 50, chroma: 100, hue: 120 },
    }

    const ratio = getContrastRatio(greenColor)
    expect(ratio).toBeGreaterThan(0)
    expect(ratio).toBeLessThan(10)
  })

  it("should work with hex colors without hash", () => {
    const color: HexValue = {
      type: ValueType.EXACT,
      value: "#ff0000",
    }

    const ratio = getContrastRatio(color)
    expect(ratio).toBeGreaterThan(0)
    expect(ratio).toBeLessThan(10)
  })

  it("should throw error for theme colors", () => {
    const themeColor: ColorThemeValue = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    }

    expect(() => {
      getContrastRatio(themeColor)
    }).toThrow(/theme.*convert/i)
  })

  it("should handle transparent color", () => {
    const transparentColor: TransparentValue = {
      type: ValueType.PRESET,
      value: Color.TRANSPARENT,
    }

    const ratio = getContrastRatio(transparentColor)
    expect(ratio).toBeGreaterThan(0)
  })
})
