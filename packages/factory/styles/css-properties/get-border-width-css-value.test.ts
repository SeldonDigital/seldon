import { describe, expect, it } from "bun:test"
import {
  BorderWidth,
  BorderWidthHairlineValue,
  BorderWidthThemeValue,
  PixelValue,
  RemValue,
  Unit,
  ValueType,
} from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getBorderWidthCSSValue } from "./get-border-width-css-value"

describe("getBorderWidthCSSValue", () => {
  it("should return hairline variable for hairline border width", () => {
    const borderWidth: BorderWidthHairlineValue = {
      type: ValueType.PRESET,
      value: BorderWidth.HAIRLINE,
    }

    const result = getBorderWidthCSSValue(borderWidth, testTheme)

    expect(result).toBe("var(--hairline)")
  })

  it("should return CSS value for exact border width", () => {
    const borderWidth: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 2 },
    }

    const result = getBorderWidthCSSValue(borderWidth, testTheme)

    expect(result).toBe("2px")
  })

  it("should return CSS value for theme ordinal border width", () => {
    const borderWidth: BorderWidthThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@borderWidth.medium",
    }

    const result = getBorderWidthCSSValue(borderWidth, testTheme)

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain("rem")
  })

  it("should handle different border width presets", () => {
    const borderWidth: BorderWidthHairlineValue = {
      type: ValueType.PRESET,
      value: BorderWidth.HAIRLINE,
    }

    const result = getBorderWidthCSSValue(borderWidth, testTheme)

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
  })

  it("should handle rem units", () => {
    const borderWidth: RemValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.5 },
    }

    const result = getBorderWidthCSSValue(borderWidth, testTheme)

    expect(result).toBe("0.5rem")
  })

  it("should handle different theme border width values", () => {
    const borderWidth: BorderWidthThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@borderWidth.large",
    }

    const result = getBorderWidthCSSValue(borderWidth, testTheme)

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain("rem")
  })
})
