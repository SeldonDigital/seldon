import { describe, expect, it } from "vitest"

import { colorspaceLiteralToHsl, parseColorspaceLiteral } from "./colorspaces"

describe("colorspaceLiteralToHsl", () => {
  it("converts a hex string and an rgb object to hsl", () => {
    expect(colorspaceLiteralToHsl("#ff0000")).toEqual({
      hue: 0,
      saturation: 100,
      lightness: 50,
    })
    expect(colorspaceLiteralToHsl({ red: 255, green: 0, blue: 0 })).toEqual({
      hue: 0,
      saturation: 100,
      lightness: 50,
    })
  })

  it("throws on an invalid color string", () => {
    expect(() => colorspaceLiteralToHsl("not-a-color")).toThrow()
  })
})

describe("parseColorspaceLiteral", () => {
  it("returns valid strings unchanged and copies color objects", () => {
    expect(parseColorspaceLiteral("#fff")).toBe("#fff")
    expect(
      parseColorspaceLiteral({ hue: 120, saturation: 50, lightness: 50 }),
    ).toEqual({ hue: 120, saturation: 50, lightness: 50 })
  })

  it("throws on null, invalid strings, and unsupported types", () => {
    expect(() => parseColorspaceLiteral(null)).toThrow()
    expect(() => parseColorspaceLiteral("xyz")).toThrow()
    expect(() => parseColorspaceLiteral(123)).toThrow()
  })
})
