import { describe, expect, it } from "vitest"

import { Colorspace } from "../constants/colorspace"
import { normalizeThemeSwatchParameters } from "./normalize-theme-swatch-parameters"

describe("normalizeThemeSwatchParameters", () => {
  it("returns canonical HSL/RGB/LCH parameters", () => {
    expect(
      normalizeThemeSwatchParameters({
        colorspace: Colorspace.HSL,
        value: { hue: 1, saturation: 2, lightness: 3, extra: 9 },
      }),
    ).toEqual({
      colorspace: Colorspace.HSL,
      value: { hue: 1, saturation: 2, lightness: 3 },
    })
    expect(
      normalizeThemeSwatchParameters({
        colorspace: Colorspace.RGB,
        value: { red: 1, green: 2, blue: 3 },
      }),
    ).toEqual({
      colorspace: Colorspace.RGB,
      value: { red: 1, green: 2, blue: 3 },
    })
  })

  it("accepts valid hex and CSS color names", () => {
    expect(
      normalizeThemeSwatchParameters({
        colorspace: Colorspace.HEX,
        value: "#aabbcc",
      }),
    ).toEqual({ colorspace: Colorspace.HEX, value: "#aabbcc" })
    expect(
      normalizeThemeSwatchParameters({
        colorspace: Colorspace.NAME,
        value: "red",
      }),
    ).toEqual({ colorspace: Colorspace.NAME, value: "red" })
  })

  it("throws on mismatched or invalid payloads", () => {
    expect(() =>
      normalizeThemeSwatchParameters({ colorspace: Colorspace.HSL, value: {} }),
    ).toThrow()
    expect(() =>
      normalizeThemeSwatchParameters({
        colorspace: Colorspace.HEX,
        value: "not-hex",
      }),
    ).toThrow()
    expect(() =>
      normalizeThemeSwatchParameters({
        colorspace: Colorspace.NAME,
        value: "#aabbcc",
      }),
    ).toThrow()
    expect(() =>
      normalizeThemeSwatchParameters({ colorspace: "cmyk", value: "x" }),
    ).toThrow()
    expect(() => normalizeThemeSwatchParameters(null)).toThrow()
  })
})
