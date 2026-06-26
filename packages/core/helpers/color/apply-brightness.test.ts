import { describe, expect, it } from "vitest"

import { applyBrightness, convertAndApplyBrightness } from "./apply-brightness"

const hsl = { hue: 0, saturation: 50, lightness: 50 }
const lch = { lightness: 50, chroma: 40, hue: 120 }

describe("applyBrightness", () => {
  it("tints an HSL value toward white for positive brightness", () => {
    expect(applyBrightness(hsl, 100)).toEqual({
      hue: 0,
      saturation: 50,
      lightness: 100,
    })
  })

  it("shades an HSL value toward black for negative brightness", () => {
    expect(applyBrightness(hsl, -100)).toEqual({
      hue: 0,
      saturation: 50,
      lightness: 0,
    })
  })

  it("leaves the value unchanged for zero brightness", () => {
    expect(applyBrightness(hsl, 0)).toEqual(hsl)
  })

  it("adjusts only lightness on an LCH value", () => {
    expect(applyBrightness(lch, 0)).toEqual(lch)
    expect(applyBrightness(lch, 100).lightness).toBe(100)
  })
})

describe("convertAndApplyBrightness", () => {
  it("converts an RGB value to HSL before applying brightness", () => {
    expect(
      convertAndApplyBrightness({ red: 255, green: 0, blue: 0 }, 0),
    ).toEqual({
      hue: 0,
      saturation: 100,
      lightness: 50,
    })
  })

  it("converts a hex string to HSL before applying brightness", () => {
    const result = convertAndApplyBrightness("#ff0000", 0)
    expect(result).toHaveProperty("saturation")
    expect((result as { lightness: number }).lightness).toBe(50)
  })

  it("passes an HSL value straight through", () => {
    expect(convertAndApplyBrightness(hsl, 0)).toEqual(hsl)
  })
})
