import { describe, expect, it } from "bun:test"
import { getHSLComponents } from "./get-hsl-components"

describe("getHSLComponents", () => {
  it("should parse standard HSL format", () => {
    expect(getHSLComponents("hsl(120, 100%, 50%)")).toEqual({
      hue: 120,
      saturation: 100,
      lightness: 50,
    })
  })

  it("should parse HSL with deg unit", () => {
    expect(getHSLComponents("hsl(120deg, 100%, 50%)")).toEqual({
      hue: 120,
      saturation: 100,
      lightness: 50,
    })
  })

  it("should parse HSL without spaces", () => {
    expect(getHSLComponents("hsl(120,100%,50%)")).toEqual({
      hue: 120,
      saturation: 100,
      lightness: 50,
    })
  })

  it("should parse HSL with space separators", () => {
    expect(getHSLComponents("hsl(120 100% 50%)")).toEqual({
      hue: 120,
      saturation: 100,
      lightness: 50,
    })
  })

  it("should parse HSL with deg and space separators", () => {
    expect(getHSLComponents("hsl(120deg 100% 50%)")).toEqual({
      hue: 120,
      saturation: 100,
      lightness: 50,
    })
  })

  it("should parse black color", () => {
    expect(getHSLComponents("hsl(0 0% 0%)")).toEqual({
      hue: 0,
      saturation: 0,
      lightness: 0,
    })
  })

  it("should parse HSL without percent signs", () => {
    expect(getHSLComponents("hsl(10,10,10)")).toEqual({
      hue: 10,
      saturation: 10,
      lightness: 10,
    })
  })

  it("should parse HSL with spaces and no percent signs", () => {
    expect(getHSLComponents("hsl(10, 10, 10)")).toEqual({
      hue: 10,
      saturation: 10,
      lightness: 10,
    })
  })

  it("should throw error for invalid lightness value", () => {
    expect(() => getHSLComponents("hsl(120, 100%, 500%)")).toThrow(
      "Invalid HSL string",
    )
  })

  it("should throw error for non-HSL format", () => {
    expect(() => getHSLComponents("#123abc")).toThrow("Invalid HSL string")
  })
})
