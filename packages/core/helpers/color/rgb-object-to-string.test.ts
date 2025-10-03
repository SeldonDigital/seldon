import { describe, expect, it } from "bun:test"
import { RGB } from "../../index"
import { RGBObjectToString } from "./rgb-object-to-string"

describe("RGBObjectToString", () => {
  it("should convert RGB object to string with default opacity", () => {
    const rgb: RGB = { red: 180, green: 50, blue: 50 }
    const result = RGBObjectToString(rgb)
    expect(result).toBe("rgb(180 50 50)")
  })

  it("should convert RGB object to string with opacity 100", () => {
    const rgb: RGB = { red: 180, green: 50, blue: 50 }
    const result = RGBObjectToString(rgb, 100)
    expect(result).toBe("rgb(180 50 50)")
  })

  it("should convert RGB object to string with null opacity", () => {
    const rgb: RGB = { red: 180, green: 50, blue: 50 }
    const result = RGBObjectToString(rgb, null)
    expect(result).toBe("rgb(180 50 50)")
  })

  it("should convert RGB object to string with custom opacity", () => {
    const rgb: RGB = { red: 180, green: 50, blue: 50 }
    const result = RGBObjectToString(rgb, 50)
    expect(result).toBe("rgb(180 50 50 / 50%)")
  })

  it("should convert red RGB object to string", () => {
    const rgb: RGB = { red: 255, green: 0, blue: 0 }
    const result = RGBObjectToString(rgb)
    expect(result).toBe("rgb(255 0 0)")
  })

  it("should convert green RGB object to string", () => {
    const rgb: RGB = { red: 0, green: 255, blue: 0 }
    const result = RGBObjectToString(rgb)
    expect(result).toBe("rgb(0 255 0)")
  })

  it("should convert blue RGB object to string", () => {
    const rgb: RGB = { red: 0, green: 0, blue: 255 }
    const result = RGBObjectToString(rgb)
    expect(result).toBe("rgb(0 0 255)")
  })

  it("should convert white RGB object to string", () => {
    const rgb: RGB = { red: 255, green: 255, blue: 255 }
    const result = RGBObjectToString(rgb)
    expect(result).toBe("rgb(255 255 255)")
  })

  it("should convert black RGB object to string", () => {
    const rgb: RGB = { red: 0, green: 0, blue: 0 }
    const result = RGBObjectToString(rgb)
    expect(result).toBe("rgb(0 0 0)")
  })

  it("should convert RGB object with zero opacity", () => {
    const rgb: RGB = { red: 180, green: 50, blue: 50 }
    const result = RGBObjectToString(rgb, 0)
    expect(result).toBe("rgb(180 50 50 / 0%)")
  })

  it("should convert RGB object with fractional opacity", () => {
    const rgb: RGB = { red: 180, green: 50, blue: 50 }
    const result = RGBObjectToString(rgb, 75.5)
    expect(result).toBe("rgb(180 50 50 / 75.5%)")
  })

  it("should convert RGB object with brightness parameter", () => {
    const rgb: RGB = { red: 180, green: 50, blue: 50 }
    const result = RGBObjectToString(rgb, 100, 20)
    expect(result).toBe("rgb(180 50 50)")
  })
})
