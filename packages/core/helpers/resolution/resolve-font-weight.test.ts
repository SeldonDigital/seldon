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

  it("should resolve theme ordinal font weights to exact values", () => {
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

  it("should resolve different theme font weight values", () => {
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

  it("should throw error for invalid font weight types", () => {
    const invalidFontWeight = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveFontWeight({
        fontWeight: invalidFontWeight as unknown as FontWeightValue,
        theme: testTheme,
      })
    }).toThrow("Invalid font weight type INVALID")
  })
})
