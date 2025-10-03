import { describe, expect, it } from "bun:test"
import { stockThemes } from ".."
import {
  getBlackColor,
  getDynamicColors,
  getGrayColor,
  getWhiteColor,
} from "./get-dynamic-colors"

describe("get-dynamic-colors", () => {
  const defaultTheme = stockThemes.find((theme) => theme.id === "default")!

  it("should calculate individual colors with correct values", () => {
    const testCases = [
      {
        name: "white",
        getter: getWhiteColor,
        expectedLightness: defaultTheme.color.whitePoint,
      },
      {
        name: "gray",
        getter: getGrayColor,
        expectedLightness: defaultTheme.color.grayPoint,
      },
      {
        name: "black",
        getter: getBlackColor,
        expectedLightness: defaultTheme.color.blackPoint,
      },
    ]

    testCases.forEach(({ name, getter, expectedLightness }) => {
      const color = getter(defaultTheme)
      expect(color.hue).toBe(0)
      expect(color.saturation).toBe(defaultTheme.color.bleed)
      expect(color.lightness).toBe(expectedLightness)
    })
  })

  it("should return all dynamic colors", () => {
    const colors = getDynamicColors(defaultTheme)
    expect(colors.white).toBeDefined()
    expect(colors.gray).toBeDefined()
    expect(colors.black).toBeDefined()
    expect(colors.swatch1).toBeDefined()
    expect(colors.swatch2).toBeDefined()
    expect(colors.swatch3).toBeDefined()
    expect(colors.swatch4).toBeDefined()
  })
})
