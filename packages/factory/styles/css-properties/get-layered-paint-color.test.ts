import { describe, expect, it } from "vitest"

import { ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

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
      }),
    ).toBe("var(--sdn-swatch-primary)")
  })

  it("emits a dedicated brightness swatch variable when brightness is adjusted in export mode", () => {
    const result = getLayeredPaintColor({
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      brightness: { type: ValueType.EXACT, value: { unit: "%", value: 50 } },
      theme: defaultTheme,
      useThemeVariableReferences: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    expect(result).toBe("var(--sdn-swatch-primary-b50)")
  })

  it("emits a darken-keyed brightness swatch variable for a negative brightness", () => {
    const result = getLayeredPaintColor({
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      brightness: { type: ValueType.EXACT, value: { unit: "%", value: -20 } },
      theme: defaultTheme,
      useThemeVariableReferences: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    expect(result).toBe("var(--sdn-swatch-primary-bn20)")
  })
})
