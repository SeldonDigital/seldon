import { describe, expect, it } from "bun:test"
import { HSL } from "../../properties/values/shared/hsl"
import { LCH } from "../../properties/values/shared/lch"
import { RGB } from "../../properties/values/shared/rgb"
import { applyBrightness, convertAndApplyBrightness } from "./apply-brightness"

describe("applyBrightness", () => {
  it("should apply negative brightness to HSL color", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 30 }
    const brightness = -50
    const result = applyBrightness(hsl, brightness)
    expect(result).toEqual({ hue: 180, saturation: 50, lightness: 15 })
  })

  it("should apply positive brightness to HSL color", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 30 }
    const brightness = 50
    const result = applyBrightness(hsl, brightness)
    expect(result).toEqual({ hue: 180, saturation: 50, lightness: 65 })
  })

  it("should clamp lightness to 100 when brightness exceeds maximum", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const brightness = 200
    const result = applyBrightness(hsl, brightness)
    expect(result).toEqual({ hue: 180, saturation: 50, lightness: 100 })
  })

  it("should clamp lightness to 0 when brightness exceeds minimum", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const brightness = -200
    const result = applyBrightness(hsl, brightness)
    expect(result).toEqual({ hue: 180, saturation: 50, lightness: 0 })
  })

  it("should apply brightness to LCH color", () => {
    const lch: LCH = { lightness: 50, chroma: 50, hue: 180 }
    const brightness = 200
    const result = applyBrightness(lch, brightness)
    expect(result).toEqual({ lightness: 100, chroma: 50, hue: 180 })
  })

  it("should preserve HSL structure when applying brightness", () => {
    const hsl: HSL = { hue: 120, saturation: 75, lightness: 40 }
    const brightness = 25
    const result = applyBrightness(hsl, brightness)
    expect(result).toHaveProperty("hue", 120)
    expect(result).toHaveProperty("saturation", 75)
    expect(result).toHaveProperty("lightness")
    expect("chroma" in result).toBe(false)
  })

  it("should preserve LCH structure when applying brightness", () => {
    const lch: LCH = { lightness: 60, chroma: 30, hue: 240 }
    const brightness = -30
    const result = applyBrightness(lch, brightness)
    expect(result).toHaveProperty("lightness")
    expect(result).toHaveProperty("chroma", 30)
    expect(result).toHaveProperty("hue", 240)
    expect("saturation" in result).toBe(false)
  })
})

describe("convertAndApplyBrightness", () => {
  it("should convert RGB to HSL and apply brightness", () => {
    const rgb: RGB = { red: 255, green: 0, blue: 0 }
    const brightness = 50
    const result = convertAndApplyBrightness(rgb, brightness)
    expect(result).toHaveProperty("hue")
    expect(result).toHaveProperty("saturation")
    expect(result).toHaveProperty("lightness")
    expect(result.lightness).toBeGreaterThan(50)
  })

  it("should convert hex string to HSL and apply brightness", () => {
    const hex = "#ff0000"
    const brightness = -25
    const result = convertAndApplyBrightness(hex, brightness)
    expect(result).toHaveProperty("hue")
    expect(result).toHaveProperty("saturation")
    expect(result).toHaveProperty("lightness")
    expect(result.lightness).toBeLessThan(50)
  })

  it("should apply brightness to HSL without conversion", () => {
    const hsl: HSL = { hue: 0, saturation: 100, lightness: 50 }
    const brightness = 20
    const result = convertAndApplyBrightness(hsl, brightness)
    expect(result).toEqual({ hue: 0, saturation: 100, lightness: 60 })
  })

  it("should apply brightness to LCH without conversion", () => {
    const lch: LCH = { lightness: 50, chroma: 100, hue: 0 }
    const brightness = -20
    const result = convertAndApplyBrightness(lch, brightness)
    expect(result).toEqual({ lightness: 40, chroma: 100, hue: 0 })
  })
})
