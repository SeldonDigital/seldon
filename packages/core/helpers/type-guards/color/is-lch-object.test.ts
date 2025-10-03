import { describe, expect, it } from "bun:test"
import { isLCHObject } from "./is-lch-object"

describe("isLCHObject", () => {
  it("should return true for valid LCH objects", () => {
    const validLCHObjects = [
      { lightness: 50, chroma: 100, hue: 120 },
      { lightness: 0, chroma: 0, hue: 0 },
      { lightness: 50.5, chroma: 100.7, hue: 120.3 },
    ]

    validLCHObjects.forEach((lch) => {
      expect(isLCHObject(lch)).toBe(true)
    })
  })

  it("should return false for invalid values", () => {
    const invalidValues = [
      null,
      undefined,
      "lch(50% 100 120deg)",
      123,
      { chroma: 100, hue: 120 },
      { lightness: 50, hue: 120 },
      { lightness: 50, chroma: 100 },
      { lightness: "50", chroma: 100, hue: 120 },
      { lightness: 50, chroma: "100", hue: 120 },
      { lightness: 50, chroma: 100, hue: "120" },
    ]

    invalidValues.forEach((value) => {
      expect(isLCHObject(value)).toBe(false)
    })
  })
})
