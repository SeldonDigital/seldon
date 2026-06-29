import { ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"
import { describe, expect, it } from "vitest"

import { getLayeredPaintColor } from "./get-layered-paint-color"

describe("getLayeredPaintColor", () => {
  it("resolves a literal color when theme references are off", () => {
    expect(
      getLayeredPaintColor({
        color: { type: ValueType.EXACT, value: "#abcdef" },
        theme: defaultTheme,
      }),
    ).toBe("#abcdef")
  })

  it("emits a swatch variable reference for a plain swatch in export mode", () => {
    expect(
      getLayeredPaintColor({
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        theme: defaultTheme,
        useThemeVariableReferences: true,
        themeSlug: "seldon",
      }),
    ).toBe("var(--sdn-swatch-primary)")
  })

  it("falls back to a literal when brightness is adjusted, even in export mode", () => {
    const result = getLayeredPaintColor({
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      brightness: { type: ValueType.EXACT, value: { unit: "%", value: 50 } },
      theme: defaultTheme,
      useThemeVariableReferences: true,
      themeSlug: "seldon",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    expect(result.startsWith("var(")).toBe(false)
  })
})
