import { describe, expect, it } from "vitest"

import type { SwatchEntry } from "./resolve-color-value"
import {
  isSwatchColorProperty,
  matchColorPhrase,
} from "./resolve-color-value"

const SWATCHES: SwatchEntry[] = [
  { key: "primary", displayName: "Primary", cssColor: "hsl(210, 100%, 50%)" },
  { key: "swatch4", displayName: "Tint 4", cssColor: "hsl(30, 40%, 50%)" },
  { key: "black", cssColor: "hsl(0, 0%, 0%)" },
]

describe("isSwatchColorProperty", () => {
  it("gates exactly the swatch-backed color schema keys", () => {
    for (const schemaKey of [
      "color",
      "accentColor",
      "backgroundColor",
      "borderColor",
      "shadowColor",
      "gradientStopColor",
    ]) {
      expect(isSwatchColorProperty(schemaKey)).toBe(true)
    }
    expect(isSwatchColorProperty("display")).toBe(false)
    expect(isSwatchColorProperty("fontSize")).toBe(false)
  })
})

describe("matchColorPhrase", () => {
  it("maps a CSS color name to its hex value", () => {
    expect(matchColorPhrase("red", SWATCHES, "color")).toEqual({
      kind: "matched",
      value: "#ff0000",
    })
  })

  it("ignores case and inner spaces on CSS color names", () => {
    expect(matchColorPhrase("Hot Pink", SWATCHES, "color")).toEqual({
      kind: "matched",
      value: "#ff69b4",
    })
  })

  it("prefers the preset option over any lookup", () => {
    expect(matchColorPhrase("transparent", SWATCHES, "color")).toEqual({
      kind: "matched",
      value: "transparent",
    })
  })

  it("maps a swatch key to its full @swatch reference, tagged", () => {
    expect(matchColorPhrase("black", SWATCHES, "color")).toEqual({
      kind: "matched",
      value: { type: "theme.categorical", value: "@swatch.black" },
    })
  })

  it("matches a swatch by display name, ignoring case and spacing", () => {
    expect(matchColorPhrase("tint 4", SWATCHES, "color")).toEqual({
      kind: "matched",
      value: { type: "theme.categorical", value: "@swatch.swatch4" },
    })
  })

  it("passes color literals through untouched", () => {
    for (const literal of [
      "#e53935",
      "rgb(255, 0, 0)",
      "hsl(120, 50%, 50%)",
      "lch(50%, 100, 120deg)",
    ]) {
      expect(matchColorPhrase(literal, SWATCHES, "color")).toEqual({
        kind: "matched",
        value: literal,
      })
    }
  })

  it("strips wrapping quotes before matching", () => {
    expect(matchColorPhrase("'red'", SWATCHES, "color")).toEqual({
      kind: "matched",
      value: "#ff0000",
    })
  })

  it("reports phrases outside every table as unmatched", () => {
    expect(matchColorPhrase("terracotta", SWATCHES, "color")).toEqual({
      kind: "unmatched",
    })
    expect(matchColorPhrase("", SWATCHES, "color")).toEqual({
      kind: "unmatched",
    })
  })
})
