import { Color, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"
import { describe, expect, it } from "vitest"

import { getColorCSSValue } from "./get-color-css-value"

describe("getColorCSSValue", () => {
  it("returns an empty string for an empty color", () => {
    expect(
      getColorCSSValue({
        color: { type: ValueType.EMPTY, value: null },
        theme: defaultTheme,
      }),
    ).toBe("")
  })

  it("returns the transparent keyword for the transparent option", () => {
    expect(
      getColorCSSValue({
        color: { type: ValueType.OPTION, value: Color.TRANSPARENT },
        theme: defaultTheme,
      }),
    ).toBe("transparent")
  })

  it("passes a hex value through untouched without brightness", () => {
    expect(
      getColorCSSValue({
        color: { type: ValueType.EXACT, value: "#ff0000" },
        theme: defaultTheme,
      }),
    ).toBe("#ff0000")
  })

  it("converts a hex value to HSL when brightness is applied", () => {
    const result = getColorCSSValue({
      color: { type: ValueType.EXACT, value: "#ff0000" },
      brightness: 20,
      theme: defaultTheme,
    })
    expect(result).toMatch(/^hsl/)
  })

  it("falls back to transparent for an unparseable color string", () => {
    expect(
      getColorCSSValue({
        color: { type: ValueType.EXACT, value: "not-a-color" as `#${string}` },
        theme: defaultTheme,
      }),
    ).toBe("transparent")
  })
})
