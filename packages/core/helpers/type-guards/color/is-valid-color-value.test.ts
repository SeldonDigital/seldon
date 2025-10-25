import { describe, expect, it } from "bun:test"
import { ColorValue, EmptyValue, ValueType } from "../../../index"
import { Color } from "../../../properties/values/appearance/color"
import { isValidColorValue } from "./is-valid-color-value"

describe("isValidColorValue", () => {
  it("should return true for valid string-based color values", () => {
    const validColors: Array<ColorValue | EmptyValue> = [
      { type: ValueType.EXACT, value: "#ff0000" },
      { type: ValueType.EXACT, value: "#f00" },
      { type: ValueType.EXACT, value: "#ff0000ff" },
      { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      { type: ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
      { type: ValueType.PRESET, value: Color.TRANSPARENT },
    ]

    validColors.forEach((color) => {
      expect(isValidColorValue(color)).toBe(true)
    })
  })

  it("should return false for invalid object-based color values", () => {
    const invalidColors: Array<ColorValue | EmptyValue> = [
      {
        type: ValueType.EXACT,
        value: { hue: 120, saturation: 50, lightness: 50 },
      },
      {
        type: ValueType.EXACT,
        value: { red: 255, green: 128, blue: 64 },
      },
      { type: ValueType.EMPTY, value: null },
    ]

    invalidColors.forEach((color) => {
      expect(isValidColorValue(color)).toBe(false)
    })
  })

  it("should narrow types correctly for valid color values", () => {
    const hexValue: ColorValue | EmptyValue = {
      type: ValueType.EXACT,
      value: "#ff0000",
    }

    if (isValidColorValue(hexValue)) {
      expect(typeof hexValue.value).toBe("string")
      expect(hexValue.value).toBe("#ff0000")
    }
  })

  it("should narrow types correctly for invalid color values", () => {
    const hslValue: ColorValue | EmptyValue = {
      type: ValueType.EXACT,
      value: {
        hue: 120,
        saturation: 50,
        lightness: 50,
      },
    }

    if (!isValidColorValue(hslValue)) {
      expect(typeof hslValue.value).toBe("object")
      expect(hslValue.value).toEqual({
        hue: 120,
        saturation: 50,
        lightness: 50,
      })
    }
  })
})
