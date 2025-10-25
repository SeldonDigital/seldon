import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../index"
import { NumberValue } from "../../properties/values/shared/number"
import {
  FontWeightThemeValue,
  FontWeightValue,
} from "../../properties/values/typography/font/font-weight"
import testTheme from "../../themes/test/test-theme"
import { resolveFontWeight } from "./resolve-font-weight"

describe("resolveFontWeight", () => {
  it("should return exact font weight values unchanged", () => {
    const exactFontWeight: NumberValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.NUMBER, value: 700 },
    }

    const result = resolveFontWeight({
      fontWeight: exactFontWeight,
      theme: testTheme,
    })

    expect(result).toEqual(exactFontWeight)
  })

  it("should return empty values unchanged", () => {
    const emptyFontWeight = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = resolveFontWeight({
      fontWeight: emptyFontWeight as FontWeightValue,
      theme: testTheme,
    })

    expect(result).toEqual(emptyFontWeight)
  })

  it("should resolve theme ordinal bold font weight to exact value", () => {
    const themeFontWeight: FontWeightThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontWeight.bold",
    }

    const result = resolveFontWeight({
      fontWeight: themeFontWeight,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.NUMBER)
    expect(result.value).toHaveProperty("value", 700)
  })

  it("should resolve theme ordinal normal font weight to exact value", () => {
    const normalFontWeight: FontWeightThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontWeight.normal",
    }

    const result = resolveFontWeight({
      fontWeight: normalFontWeight,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.NUMBER)
    expect(result.value).toHaveProperty("value", 400)
  })

  it("should resolve theme ordinal light font weight to exact value", () => {
    const lightFontWeight: FontWeightThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontWeight.light",
    }

    const result = resolveFontWeight({
      fontWeight: lightFontWeight,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.NUMBER)
    expect(result.value).toHaveProperty("value", 300)
  })

  it("should throw error for computed values", () => {
    const computedFontWeight = {
      type: ValueType.COMPUTED,
      value: {
        function: "auto_fit",
        input: { basedOn: "#parent.fontWeight", factor: 1.5 },
      },
    }

    expect(() => {
      resolveFontWeight({
        fontWeight: computedFontWeight as FontWeightValue,
        theme: testTheme,
      })
    }).toThrow("Invalid font weight type computed")
  })

  it("should throw error for non-existent theme values", () => {
    const invalidThemeFontWeight = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontWeight.nonexistent",
    }

    expect(() => {
      resolveFontWeight({
        fontWeight: invalidThemeFontWeight as FontWeightValue,
        theme: testTheme,
      })
    }).toThrow("Theme value @fontWeight.nonexistent not found")
  })

  it("should throw error for invalid font weight types", () => {
    const invalidFontWeight = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveFontWeight({
        fontWeight: invalidFontWeight as FontWeightValue,
        theme: testTheme,
      })
    }).toThrow("Invalid font weight type INVALID")
  })
})
