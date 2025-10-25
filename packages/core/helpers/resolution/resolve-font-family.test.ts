import { describe, expect, it } from "bun:test"
import { ValueType } from "../../index"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import {
  FontFamilyPresetValue,
  FontFamilyValue,
} from "../../properties/values/typography/font/font-family"
import { FontFamilyThemeValue } from "../../properties/values/typography/font/font-family"
import testTheme from "../../themes/test/test-theme"
import { resolveFontFamily } from "./resolve-font-family"

describe("resolveFontFamily", () => {
  it("should return exact font family values unchanged", () => {
    const exactFontFamily: FontFamilyPresetValue = {
      type: ValueType.EXACT,
      value: "Arial, sans-serif",
    }

    const result = resolveFontFamily({
      fontFamily: exactFontFamily,
      theme: testTheme,
    })

    expect(result).toEqual({
      type: ValueType.PRESET,
      value: "Arial, sans-serif",
    })
  })

  it("should return preset font family values unchanged", () => {
    const presetFontFamily: FontFamilyPresetValue = {
      type: ValueType.PRESET,
      value: "Arial, sans-serif",
    }

    const result = resolveFontFamily({
      fontFamily: presetFontFamily,
      theme: testTheme,
    })

    expect(result).toEqual(presetFontFamily)
  })

  it("should return undefined for empty values", () => {
    const emptyFontFamily: EmptyValue = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = resolveFontFamily({
      fontFamily: emptyFontFamily,
      theme: testTheme,
    })

    expect(result).toBeUndefined()
  })

  it("should return undefined for undefined input", () => {
    const result = resolveFontFamily({
      fontFamily: undefined,
      theme: testTheme,
    })

    expect(result).toBeUndefined()
  })

  it("should resolve theme categorical primary font family to preset value", () => {
    const themeFontFamily: FontFamilyThemeValue = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@fontFamily.primary",
    }

    const result = resolveFontFamily({
      fontFamily: themeFontFamily,
      theme: testTheme,
    })

    expect(result).toEqual({
      type: ValueType.PRESET,
      value: testTheme.fontFamily.primary,
    })
  })

  it("should resolve theme categorical secondary font family to preset value", () => {
    const themeFontFamily: FontFamilyThemeValue = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@fontFamily.secondary",
    }

    const result = resolveFontFamily({
      fontFamily: themeFontFamily,
      theme: testTheme,
    })

    expect(result).toEqual({
      type: ValueType.PRESET,
      value: testTheme.fontFamily.secondary,
    })
  })

  it("should throw error for computed values", () => {
    const computedFontFamily = {
      type: ValueType.COMPUTED,
      value: {
        function: "auto_fit",
        input: { basedOn: "#parent.fontFamily", factor: 1.5 },
      },
    }

    expect(() => {
      resolveFontFamily({
        fontFamily: computedFontFamily as FontFamilyValue,
        theme: testTheme,
      })
    }).toThrow(
      "resolveFontFamily received a COMPUTED value. This should have been computed in the compute function.",
    )
  })

  it("should throw error for non-existent theme values", () => {
    const invalidThemeFontFamily = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@fontFamily.nonexistent",
    }

    expect(() => {
      resolveFontFamily({
        fontFamily: invalidThemeFontFamily as FontFamilyValue,
        theme: testTheme,
      })
    }).toThrow("Theme value @fontFamily.nonexistent not found")
  })

  it("should throw error for invalid font family types", () => {
    const invalidFontFamily = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveFontFamily({
        fontFamily: invalidFontFamily as FontFamilyValue,
        theme: testTheme,
      })
    }).toThrow("Invalid font family type INVALID")
  })
})
