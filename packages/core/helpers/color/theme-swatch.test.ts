import { describe, expect, it } from "vitest"

import { ValueType } from "../../index"
import { Colorspace } from "../../themes/constants/colorspace"
import { TokenType } from "../../themes/constants/token-type"
import type { ThemeSwatch } from "../../themes/types"
import { themeSwatchToColorValue } from "./theme-swatch-to-color-value"
import { themeSwatchToCssBackground } from "./theme-swatch-to-css-background"

const swatch = (parameters: unknown): ThemeSwatch =>
  ({ type: TokenType.SWATCH, parameters }) as ThemeSwatch

describe("themeSwatchToColorValue", () => {
  it("preserves the authoring colorspace value", () => {
    const hsl = { hue: 10, saturation: 20, lightness: 30 }
    expect(
      themeSwatchToColorValue(
        swatch({ colorspace: Colorspace.HSL, value: hsl }),
      ),
    ).toEqual({ type: ValueType.EXACT, value: hsl })
    expect(
      themeSwatchToColorValue(
        swatch({ colorspace: Colorspace.HEX, value: "#abcdef" }),
      ),
    ).toEqual({ type: ValueType.EXACT, value: "#abcdef" })
  })
})

describe("themeSwatchToCssBackground", () => {
  it("formats each colorspace into a CSS color string", () => {
    expect(
      themeSwatchToCssBackground(
        swatch({
          colorspace: Colorspace.HSL,
          value: { hue: 120, saturation: 50, lightness: 50 },
        }),
      ),
    ).toBe("hsl(120 50% 50%)")
    expect(
      themeSwatchToCssBackground(
        swatch({
          colorspace: Colorspace.RGB,
          value: { red: 1, green: 2, blue: 3 },
        }),
      ),
    ).toBe("rgb(1 2 3)")
    expect(
      themeSwatchToCssBackground(
        swatch({ colorspace: Colorspace.HEX, value: "#abcdef" }),
      ),
    ).toBe("#abcdef")
  })

  it("returns undefined for a missing or non-swatch value", () => {
    expect(themeSwatchToCssBackground(undefined)).toBeUndefined()
    expect(
      themeSwatchToCssBackground({
        type: "modulated",
      } as unknown as ThemeSwatch),
    ).toBeUndefined()
  })
})
