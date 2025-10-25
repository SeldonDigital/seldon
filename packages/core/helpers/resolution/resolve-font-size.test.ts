import { describe, expect, it } from "bun:test"
import { EmptyValue, PixelValue, RemValue, Unit, ValueType } from "../../index"
import {
  FontSizeThemeValue,
  FontSizeValue,
} from "../../properties/values/typography/font/font-size"
import testTheme from "../../themes/test/test-theme"
import { resolveFontSize } from "./resolve-font-size"

describe("resolveFontSize", () => {
  it("should return exact pixel font size values unchanged", () => {
    const exactFontSize: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 16 },
    }

    const result = resolveFontSize({
      fontSize: exactFontSize,
      theme: testTheme,
    })

    expect(result).toEqual(exactFontSize)
  })

  it("should return exact rem font size values unchanged", () => {
    const exactFontSize: RemValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 1.5 },
    }

    const result = resolveFontSize({
      fontSize: exactFontSize,
      theme: testTheme,
    })

    expect(result).toEqual(exactFontSize)
  })

  it("should return empty values unchanged", () => {
    const emptyFontSize: EmptyValue = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = resolveFontSize({
      fontSize: emptyFontSize,
      theme: testTheme,
    })

    expect(result).toEqual(emptyFontSize)
  })

  it("should resolve theme ordinal medium font size to exact value", () => {
    const themeFontSize: FontSizeThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    }

    const result = resolveFontSize({
      fontSize: themeFontSize,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should resolve theme ordinal large font size to exact value", () => {
    const themeFontSize: FontSizeThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.large",
    }

    const result = resolveFontSize({
      fontSize: themeFontSize,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should resolve theme ordinal small font size to exact value", () => {
    const themeFontSize: FontSizeThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.small",
    }

    const result = resolveFontSize({
      fontSize: themeFontSize,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should throw error for computed values", () => {
    const computedFontSize = {
      type: ValueType.COMPUTED,
      value: {
        function: "auto_fit",
        input: { basedOn: "#parent.fontSize", factor: 1.5 },
      },
    }

    expect(() => {
      resolveFontSize({
        fontSize: computedFontSize as FontSizeValue,
        theme: testTheme,
      })
    }).toThrow(
      "resolveFontSize received a COMPUTED value. This should have been computed in the compute function.",
    )
  })

  it("should throw error for non-existent theme values", () => {
    const invalidThemeFontSize = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.nonexistent",
    }

    expect(() => {
      resolveFontSize({
        fontSize: invalidThemeFontSize as FontSizeValue,
        theme: testTheme,
      })
    }).toThrow("Theme value @fontSize.nonexistent not found")
  })

  it("should throw error for invalid font size types", () => {
    const invalidFontSize = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveFontSize({
        fontSize: invalidFontSize as FontSizeValue,
        theme: testTheme,
      })
    }).toThrow("Invalid font size type INVALID")
  })
})
