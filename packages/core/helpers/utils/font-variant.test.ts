import { describe, expect, it } from "vitest"

import {
  buildGoogleFontAxisParam,
  fontVariantDisplayLabel,
  parseFontVariant,
  sortFontVariants,
} from "./font-variant"

describe("parseFontVariant", () => {
  it("parses weight and italic flag", () => {
    expect(parseFontVariant("700italic")).toEqual({ weight: 700, italic: true })
    expect(parseFontVariant("100")).toEqual({ weight: 100, italic: false })
  })

  it("treats regular and bare italic as weight 400", () => {
    expect(parseFontVariant("regular")).toEqual({ weight: 400, italic: false })
    expect(parseFontVariant("italic")).toEqual({ weight: 400, italic: true })
  })

  it("falls back to 400 for non-numeric weights", () => {
    expect(parseFontVariant("abc")).toEqual({ weight: 400, italic: false })
  })
})

describe("fontVariantDisplayLabel", () => {
  it("formats a human label", () => {
    expect(fontVariantDisplayLabel("700italic")).toBe("700 Italic")
    expect(fontVariantDisplayLabel("400")).toBe("400")
  })
})

describe("sortFontVariants", () => {
  it("orders uprights before italics, then by ascending weight", () => {
    expect(
      sortFontVariants(["700italic", "100", "regular", "100italic"]),
    ).toEqual(["100", "regular", "100italic", "700italic"])
  })

  it("returns a new array", () => {
    const input = ["100"]
    expect(sortFontVariants(input)).not.toBe(input)
  })
})

describe("buildGoogleFontAxisParam", () => {
  it("returns an empty string with no variants", () => {
    expect(buildGoogleFontAxisParam([])).toBe("")
  })

  it("dedupes and sorts tuples by italic then weight", () => {
    expect(buildGoogleFontAxisParam(["400", "400", "700italic"])).toBe(
      "ital,wght@0,400;1,700",
    )
  })
})
