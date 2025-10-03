import { describe, expect, it } from "bun:test"
import { HSL } from "../../index"
import { HSLObjectToString } from "./hsl-object-to-string"

describe("HSLObjectToString", () => {
  it("should convert HSL object to string with default opacity", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const result = HSLObjectToString(hsl)
    expect(result).toBe("hsl(180 50% 50%)")
  })

  it("should convert HSL object to string with opacity 100", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const result = HSLObjectToString(hsl, 100)
    expect(result).toBe("hsl(180 50% 50%)")
  })

  it("should convert HSL object to string with opacity null", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const result = HSLObjectToString(hsl, null)
    expect(result).toBe("hsl(180 50% 50%)")
  })

  it("should convert HSL object to string with custom opacity", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const result = HSLObjectToString(hsl, 50)
    expect(result).toBe("hsl(180 50% 50% / 50%)")
  })

  it("should convert red HSL object to string", () => {
    const hsl: HSL = { hue: 0, saturation: 100, lightness: 50 }
    const result = HSLObjectToString(hsl)
    expect(result).toBe("hsl(0 100% 50%)")
  })

  it("should convert green HSL object to string", () => {
    const hsl: HSL = { hue: 120, saturation: 100, lightness: 50 }
    const result = HSLObjectToString(hsl)
    expect(result).toBe("hsl(120 100% 50%)")
  })

  it("should convert blue HSL object to string", () => {
    const hsl: HSL = { hue: 240, saturation: 100, lightness: 50 }
    const result = HSLObjectToString(hsl)
    expect(result).toBe("hsl(240 100% 50%)")
  })

  it("should convert white HSL object to string", () => {
    const hsl: HSL = { hue: 0, saturation: 0, lightness: 100 }
    const result = HSLObjectToString(hsl)
    expect(result).toBe("hsl(0 0% 100%)")
  })

  it("should convert black HSL object to string", () => {
    const hsl: HSL = { hue: 0, saturation: 0, lightness: 0 }
    const result = HSLObjectToString(hsl)
    expect(result).toBe("hsl(0 0% 0%)")
  })

  it("should convert HSL object with zero opacity", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const result = HSLObjectToString(hsl, 0)
    expect(result).toBe("hsl(180 50% 50% / 0%)")
  })

  it("should convert HSL object with maximum opacity", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const result = HSLObjectToString(hsl, 100)
    expect(result).toBe("hsl(180 50% 50%)")
  })

  it("should convert HSL object with fractional opacity", () => {
    const hsl: HSL = { hue: 180, saturation: 50, lightness: 50 }
    const result = HSLObjectToString(hsl, 75.5)
    expect(result).toBe("hsl(180 50% 50% / 75.5%)")
  })
})
