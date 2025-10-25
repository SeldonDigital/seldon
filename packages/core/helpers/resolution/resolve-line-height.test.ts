import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../index"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import { NumberValue } from "../../properties/values/shared/number"
import {
  LineHeightThemeValue,
  LineHeightValue,
} from "../../properties/values/typography/font/line-height"
import testTheme from "../../themes/test/test-theme"
import { resolveLineHeight } from "./resolve-line-height"

describe("resolveLineHeight", () => {
  it("should return exact line height values unchanged", () => {
    const exactLineHeight: NumberValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.NUMBER, value: 1.5 },
    }

    const result = resolveLineHeight({
      lineHeight: exactLineHeight,
      theme: testTheme,
    })

    expect(result).toEqual(exactLineHeight)
  })

  it("should return empty values unchanged", () => {
    const emptyLineHeight: EmptyValue = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = resolveLineHeight({
      lineHeight: emptyLineHeight,
      theme: testTheme,
    })

    expect(result).toEqual(emptyLineHeight)
  })

  it("should resolve theme ordinal tight line height to exact value", () => {
    const themeLineHeight: LineHeightThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@lineHeight.tight",
    }

    const result = resolveLineHeight({
      lineHeight: themeLineHeight,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.NUMBER)
    expect(result.value).toHaveProperty("value", 1.25)
  })

  it("should resolve theme ordinal cozy line height to exact value", () => {
    const cozyLineHeight: LineHeightThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@lineHeight.cozy",
    }

    const result = resolveLineHeight({
      lineHeight: cozyLineHeight,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.NUMBER)
    expect(result.value).toHaveProperty("value", 1.5)
  })

  it("should resolve theme ordinal comfortable line height to exact value", () => {
    const comfortableLineHeight: LineHeightThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@lineHeight.comfortable",
    }

    const result = resolveLineHeight({
      lineHeight: comfortableLineHeight,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.NUMBER)
    expect(result.value).toHaveProperty("value", 2.0)
  })

  it("should throw error for computed values", () => {
    const computedLineHeight = {
      type: ValueType.COMPUTED,
      value: {
        function: "auto_fit",
        input: { basedOn: "#parent.lineHeight", factor: 1.5 },
      },
    }

    expect(() => {
      resolveLineHeight({
        lineHeight: computedLineHeight as LineHeightValue,
        theme: testTheme,
      })
    }).toThrow("Invalid line height type computed")
  })

  it("should throw error for non-existent theme values", () => {
    const invalidThemeLineHeight = {
      type: ValueType.THEME_ORDINAL,
      value: "@lineHeight.nonexistent",
    }

    expect(() => {
      resolveLineHeight({
        lineHeight: invalidThemeLineHeight as LineHeightValue,
        theme: testTheme,
      })
    }).toThrow("Theme value @lineHeight.nonexistent not found")
  })

  it("should throw error for invalid line height types", () => {
    const invalidLineHeight = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveLineHeight({
        lineHeight: invalidLineHeight as LineHeightValue,
        theme: testTheme,
      })
    }).toThrow("Invalid line height type INVALID")
  })
})
