import { describe, expect, it } from "bun:test"
import { isThemeValueKey } from "./theme"

describe("Theme functions", () => {
  it("should validate theme value keys correctly", () => {
    const validThemeKeys = [
      "@swatch.green",
      "@swatch.swatch2",
      "@swatch.light-green",
      "@fontSize.large",
    ]

    const invalidThemeKeys = [
      "@font-size.Green1", // case sensitive
      "@green", // missing group
      "swatch.green", // missing @
    ]

    validThemeKeys.forEach((key) => {
      expect(isThemeValueKey(key)).toBe(true)
    })

    invalidThemeKeys.forEach((key) => {
      expect(isThemeValueKey(key)).toBe(false)
    })
  })
})
