import { describe, expect, it } from "bun:test"
import { stockThemes } from ".."

describe("compute-theme", () => {
  it("should return a theme with computed colors", () => {
    const defaultTheme = stockThemes.find((theme) => theme.id === "default")!
    const computedTheme = defaultTheme

    expect(computedTheme.swatch.white.value.hue).toBe(0)
    expect(computedTheme.swatch.white.value.saturation).toBe(
      defaultTheme.color.bleed,
    )
    expect(computedTheme.swatch.white.value.lightness).toBe(
      defaultTheme.color.whitePoint,
    )
  })
})
