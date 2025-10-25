import { describe, expect, it } from "bun:test"
import { LCH } from "../../properties/values/shared/lch"
import { LCHObjectToString } from "./lch-object-to-string"

describe("LCHObjectToString", () => {
  it("should convert LCH object to string with default opacity", () => {
    const lch: LCH = { lightness: 50, chroma: 100, hue: 120 }
    const result = LCHObjectToString(lch)
    expect(result).toBe("lch(50% 100 120deg)")
  })

  it("should convert LCH object to string with custom opacity", () => {
    const lch: LCH = { lightness: 50, chroma: 100, hue: 120 }
    const result = LCHObjectToString(lch, 80)
    expect(result).toBe("lch(50% 100 120deg / 80%)")
  })

  it("should convert LCH object to string with null opacity", () => {
    const lch: LCH = { lightness: 50, chroma: 100, hue: 120 }
    const result = LCHObjectToString(lch, null)
    expect(result).toBe("lch(50% 100 120deg)")
  })

  it("should convert LCH object to string with opacity 100", () => {
    const lch: LCH = { lightness: 50, chroma: 100, hue: 120 }
    const result = LCHObjectToString(lch, 100)
    expect(result).toBe("lch(50% 100 120deg)")
  })

  it("should convert LCH object with zero values", () => {
    const lch: LCH = { lightness: 0, chroma: 0, hue: 0 }
    const result = LCHObjectToString(lch)
    expect(result).toBe("lch(0% 0 0deg)")
  })

  it("should convert LCH object with maximum values", () => {
    const lch: LCH = { lightness: 100, chroma: 150, hue: 360 }
    const result = LCHObjectToString(lch)
    expect(result).toBe("lch(100% 150 360deg)")
  })

  it("should convert LCH object with zero opacity", () => {
    const lch: LCH = { lightness: 50, chroma: 100, hue: 120 }
    const result = LCHObjectToString(lch, 0)
    expect(result).toBe("lch(50% 100 120deg / 0%)")
  })

  it("should convert LCH object with fractional opacity", () => {
    const lch: LCH = { lightness: 50, chroma: 100, hue: 120 }
    const result = LCHObjectToString(lch, 75.5)
    expect(result).toBe("lch(50% 100 120deg / 75.5%)")
  })

  it("should convert LCH object with fractional lightness", () => {
    const lch: LCH = { lightness: 50.5, chroma: 100, hue: 120 }
    const result = LCHObjectToString(lch)
    expect(result).toBe("lch(50.5% 100 120deg)")
  })

  it("should convert LCH object with fractional chroma", () => {
    const lch: LCH = { lightness: 50, chroma: 100.5, hue: 120 }
    const result = LCHObjectToString(lch)
    expect(result).toBe("lch(50% 100.5 120deg)")
  })

  it("should convert LCH object with fractional hue", () => {
    const lch: LCH = { lightness: 50, chroma: 100, hue: 120.5 }
    const result = LCHObjectToString(lch)
    expect(result).toBe("lch(50% 100 120.5deg)")
  })
})
