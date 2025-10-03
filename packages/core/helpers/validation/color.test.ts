import { describe, expect, it } from "bun:test"
import {
  isHSLString,
  isHex,
  isHexWithoutHash,
  isLCHString,
  isRGBString,
  isValidColor,
  isValidExactColor,
} from "."

describe("Color functions", () => {
  it("should validate colors correctly", () => {
    const validColors = [
      "hsl(120, 100%, 50%)",
      "rgb(255 0 0)",
      "lch(50% 100 120deg)",
      "#123abc",
      "ff0000",
      "@swatch.green",
    ]

    const invalidColors = ["#invalid", "invalid"]

    validColors.forEach((color) => {
      expect(isValidColor(color)).toBe(true)
    })

    invalidColors.forEach((color) => {
      expect(isValidColor(color)).toBe(false)
    })
  })

  it("should validate exact colors correctly", () => {
    const validExactColors = [
      "hsl(120, 100%, 50%)",
      "rgb(255 0 0)",
      "lch(50% 100 120deg)",
      "#123abc",
    ]

    const invalidExactColors = ["#invalid", "invalid"]

    validExactColors.forEach((color) => {
      expect(isValidExactColor(color)).toBe(true)
    })

    invalidExactColors.forEach((color) => {
      expect(isValidExactColor(color)).toBe(false)
    })
  })

  it("should validate HSL strings correctly", () => {
    const validHSL = [
      "hsl(120, 100%, 50%)",
      "hsl(120deg, 100%, 50%)",
      "hsl(120,100%,50%)",
      "hsl(120 100% 50%)",
      "hsl(120deg 100% 50%)",
      "hsl(120 0 0)",
      "hsl(120,0,0)",
      "hsl(120, 0, 0)",
      "hsl(10,10,10)",
    ]

    const invalidHSL = ["hsl(120 100% 50% / 80%)", "hsl(120, 100%, 500%)"]

    validHSL.forEach((hsl) => {
      expect(isHSLString(hsl)).toBe(true)
    })

    invalidHSL.forEach((hsl) => {
      expect(isHSLString(hsl)).toBe(false)
    })
  })

  it("should validate RGB strings correctly", () => {
    const validRGB = ["rgb(31 120 50)", "rgb(31, 120, 50)"]

    const invalidRGB = [
      "rgb(31, 120, 50, 100)",
      "rgb(30% 20% 50%)",
      "rgb(255 122 127 / 80%)",
    ]

    validRGB.forEach((rgb) => {
      expect(isRGBString(rgb)).toBe(true)
    })

    invalidRGB.forEach((rgb) => {
      expect(isRGBString(rgb)).toBe(false)
    })
  })

  it("should validate LCH strings correctly", () => {
    const validLCH = [
      "lch(50% 100 120deg)",
      "lch(50%, 100, 120deg)",
      "lch(50 100 120)",
      "lch(50%, 100, 120)",
      "lch(50 100 120deg)",
      "lch(50,100,120deg)",
      "lch(0% 0 0)",
      "lch(100% 150 360deg)",
    ]

    const invalidLCH = [
      "lch(50% 100 120deg / 80%)",
      "lch(150% 100 120deg)",
      "lch(50% 200 120deg)",
    ]

    validLCH.forEach((lch) => {
      expect(isLCHString(lch)).toBe(true)
    })

    invalidLCH.forEach((lch) => {
      expect(isLCHString(lch)).toBe(false)
    })
  })

  it("should validate hex colors correctly", () => {
    const validHex = ["#123abc", "#123ABC", "#123"]
    const invalidHex = ["#123ab", "123abc"]

    validHex.forEach((hex) => {
      expect(isHex(hex)).toBe(true)
    })

    invalidHex.forEach((hex) => {
      expect(isHex(hex)).toBe(false)
    })
  })

  it("should validate hex without hash correctly", () => {
    const validHexWithoutHash = ["123abc", "123ABC", "123"]
    const invalidHexWithoutHash = ["123ab", "#123abc"]

    validHexWithoutHash.forEach((hex) => {
      expect(isHexWithoutHash(hex)).toBe(true)
    })

    invalidHexWithoutHash.forEach((hex) => {
      expect(isHexWithoutHash(hex)).toBe(false)
    })
  })
})
