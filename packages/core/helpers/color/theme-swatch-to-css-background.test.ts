import { describe, expect, it } from "bun:test"
import { Colorspace } from "../../themes/constants/colorspace"
import { TokenType } from "../../themes/constants/token-type"
import { themeSwatchToCssBackground } from "./theme-swatch-to-css-background"

describe("themeSwatchToCssBackground", () => {
  it("formats HSL swatch parameters", () => {
    const swatch = {
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 210, saturation: 50, lightness: 40 },
      },
    }

    expect(themeSwatchToCssBackground(swatch)).toBe("hsl(210 50% 40%)")
  })
})
