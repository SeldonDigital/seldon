import { describe, expect, it } from "vitest"

import {
  hexToHSLObject,
  parseHSLString,
  parseLCHString,
  parseRGBString,
  rgbToHSL,
  toHSLString,
} from "./convert-color"

describe("rgbToHSL", () => {
  it("converts primary red", () => {
    expect(rgbToHSL({ red: 255, green: 0, blue: 0 })).toEqual({
      hue: 0,
      saturation: 100,
      lightness: 50,
    })
  })

  it("converts white and black to zero saturation", () => {
    expect(rgbToHSL({ red: 255, green: 255, blue: 255 })).toEqual({
      hue: 0,
      saturation: 0,
      lightness: 100,
    })
    expect(rgbToHSL({ red: 0, green: 0, blue: 0 })).toEqual({
      hue: 0,
      saturation: 0,
      lightness: 0,
    })
  })
})

describe("hexToHSLObject", () => {
  it("parses hex with and without a hash", () => {
    expect(hexToHSLObject("#ff0000")).toEqual({
      hue: 0,
      saturation: 100,
      lightness: 50,
    })
    expect(hexToHSLObject("00ff00")).toEqual({
      hue: 120,
      saturation: 100,
      lightness: 50,
    })
  })
})

describe("parseHSLString", () => {
  it("parses comma and space separated forms", () => {
    expect(parseHSLString("hsl(120, 50%, 50%)")).toEqual({
      hue: 120,
      saturation: 50,
      lightness: 50,
    })
    expect(parseHSLString("hsl(120 50% 50%)")).toEqual({
      hue: 120,
      saturation: 50,
      lightness: 50,
    })
  })

  it("throws on malformed or out-of-range input", () => {
    expect(() => parseHSLString("garbage")).toThrow()
    expect(() => parseHSLString("hsl(400, 50%, 50%)")).toThrow()
  })
})

describe("parseRGBString", () => {
  it("parses a valid rgb string", () => {
    expect(parseRGBString("rgb(255, 0, 0)")).toEqual({
      red: 255,
      green: 0,
      blue: 0,
    })
  })

  it("throws on malformed or out-of-range input", () => {
    expect(() => parseRGBString("nope")).toThrow()
    expect(() => parseRGBString("rgb(256, 0, 0)")).toThrow()
  })
})

describe("parseLCHString", () => {
  it("parses a valid lch string", () => {
    expect(parseLCHString("lch(50% 100 120deg)")).toEqual({
      lightness: 50,
      chroma: 100,
      hue: 120,
    })
  })

  it("throws when chroma is out of range", () => {
    expect(() => parseLCHString("lch(50% 200 120deg)")).toThrow()
  })
})

describe("toHSLString", () => {
  it("passes through an hsl string and converts hex", () => {
    expect(toHSLString("hsl(120 50% 50%)")).toBe("hsl(120 50% 50%)")
    expect(toHSLString("#ff0000")).toMatch(/^hsl\(/)
  })

  it("throws on an unrecognized value", () => {
    expect(() => toHSLString("not-a-color")).toThrow()
  })
})
