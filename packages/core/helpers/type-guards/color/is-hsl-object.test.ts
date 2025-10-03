import { describe, expect, it } from "bun:test"
import { isHSLObject } from "./is-hsl-object"

describe("isHSLObject", () => {
  it("should return true for valid HSL objects", () => {
    const validHSLObjects = [
      { hue: 120, saturation: 50, lightness: 50 },
      { hue: 0, saturation: 0, lightness: 0 },
      { hue: 120.5, saturation: 50.7, lightness: 50.3 },
    ]

    validHSLObjects.forEach((hsl) => {
      expect(isHSLObject(hsl)).toBe(true)
    })
  })

  it("should return false for invalid values", () => {
    const invalidValues = [
      null,
      undefined,
      "hsl(120, 50%, 50%)",
      123,
      { saturation: 50, lightness: 50 },
      { hue: 120, lightness: 50 },
      { hue: 120, saturation: 50 },
      { hue: "120", saturation: 50, lightness: 50 },
      { hue: 120, saturation: "50", lightness: 50 },
      { hue: 120, saturation: 50, lightness: "50" },
    ]

    invalidValues.forEach((value) => {
      expect(isHSLObject(value)).toBe(false)
    })
  })
})
