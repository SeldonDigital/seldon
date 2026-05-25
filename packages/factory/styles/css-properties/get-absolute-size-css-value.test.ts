import { describe, expect, it } from "bun:test"
import {
  Corner,
  CornerRoundedValue,
  CornerSquaredValue,
  CornerThemeValue,
  MarginSideThemeValue,
  PaddingSideThemeValue,
  PixelValue,
  RemValue,
  Unit,
  ValueType,
} from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"

describe("getAbsoluteSizeCssValue", () => {
  it("should return exact pixel values", () => {
    const exactValue: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 16 },
    }

    const result = getAbsoluteSizeCssValue(exactValue, testTheme)

    expect(result).toBe("16px")
  })

  it("should return exact rem values", () => {
    const exactValue: RemValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 1.5 },
    }

    const result = getAbsoluteSizeCssValue(exactValue, testTheme)

    expect(result).toBe("1.5rem")
  })

  it("should resolve theme ordinal values to rem", () => {
    const themeValue: MarginSideThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@margin.cozy",
    }

    const result = getAbsoluteSizeCssValue(themeValue, testTheme)

    expect(result).toContain("rem")
    expect(result).not.toContain("px")
    expect(result).not.toContain("%")
  })

  it("should resolve different theme ordinal values", () => {
    const smallThemeValue: MarginSideThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@margin.tight",
    }

    const largeThemeValue: MarginSideThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@margin.comfortable",
    }

    const smallResult = getAbsoluteSizeCssValue(smallThemeValue, testTheme)
    const largeResult = getAbsoluteSizeCssValue(largeThemeValue, testTheme)

    expect(smallResult).toContain("rem")
    expect(largeResult).toContain("rem")
    expect(smallResult).not.toBe(largeResult)
  })

  it("should handle corner values", () => {
    const cornerValue: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 8 },
    }

    const result = getAbsoluteSizeCssValue(cornerValue, testTheme)

    expect(result).toBe("8px")
  })

  it("should handle padding side values", () => {
    const paddingValue: RemValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.5 },
    }

    const result = getAbsoluteSizeCssValue(paddingValue, testTheme)

    expect(result).toBe("0.5rem")
  })

  it("should handle margin side values", () => {
    const marginValue: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 12 },
    }

    const result = getAbsoluteSizeCssValue(marginValue, testTheme)

    expect(result).toBe("12px")
  })

  it("should handle zero values", () => {
    const zeroValue: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 0 },
    }

    const result = getAbsoluteSizeCssValue(zeroValue, testTheme)

    expect(result).toBe("0px")
  })

  it("should handle decimal values", () => {
    const decimalValue: RemValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.125 },
    }

    const result = getAbsoluteSizeCssValue(decimalValue, testTheme)

    expect(result).toBe("0.125rem")
  })

  it("should handle large values", () => {
    const largeValue: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 9999 },
    }

    const result = getAbsoluteSizeCssValue(largeValue, testTheme)

    expect(result).toBe("9999px")
  })

  it("should handle negative values", () => {
    const negativeValue: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: -10 },
    }

    const result = getAbsoluteSizeCssValue(negativeValue, testTheme)

    expect(result).toBe("-10px")
  })

  it("should handle theme ordinal corner values", () => {
    const themeCornerValue: CornerThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@corners.cozy",
    }

    const result = getAbsoluteSizeCssValue(themeCornerValue, testTheme)

    expect(result).toContain("rem")
    expect(result).not.toContain("px")
  })

  it("should handle theme ordinal padding values", () => {
    const themePaddingValue: PaddingSideThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@padding.comfortable",
    }

    const result = getAbsoluteSizeCssValue(themePaddingValue, testTheme)

    expect(result).toContain("rem")
    expect(result).not.toContain("px")
  })

  it("should handle corner rounded preset values", () => {
    const roundedValue: CornerRoundedValue = {
      type: ValueType.PRESET,
      value: Corner.ROUNDED,
    }

    const result = getAbsoluteSizeCssValue(roundedValue, testTheme)

    expect(result).toBe("99999px")
  })

  it("should handle corner squared preset values", () => {
    const squaredValue: CornerSquaredValue = {
      type: ValueType.PRESET,
      value: Corner.SQUARED,
    }

    const result = getAbsoluteSizeCssValue(squaredValue, testTheme)

    expect(result).toBe("0px")
  })
})
