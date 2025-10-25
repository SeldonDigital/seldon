import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../index"
import {
  ShadowBlurThemeValue,
  ShadowBlurValue,
} from "../../properties/values/effects/shadow/shadow-blur"
import { PixelValue } from "../../properties/values/shared/pixel"
import { RemValue } from "../../properties/values/shared/rem"
import testTheme from "../../themes/test/test-theme"
import { resolveShadowBlur } from "./resolve-shadow-blur"

describe("resolveShadowBlur", () => {
  it("should return exact pixel blur values unchanged", () => {
    const exactBlur: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 4 },
    }

    const result = resolveShadowBlur({
      blur: exactBlur,
      theme: testTheme,
    })

    expect(result).toEqual(exactBlur)
  })

  it("should return exact rem blur values unchanged", () => {
    const exactBlur: RemValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.25 },
    }

    const result = resolveShadowBlur({
      blur: exactBlur,
      theme: testTheme,
    })

    expect(result).toEqual(exactBlur)
  })

  it("should return empty values unchanged", () => {
    const emptyBlur = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = resolveShadowBlur({
      blur: emptyBlur as ShadowBlurValue,
      theme: testTheme,
    })

    expect(result).toEqual(emptyBlur)
  })

  it("should resolve theme ordinal medium blur to exact value", () => {
    const themeBlur: ShadowBlurThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@blur.medium",
    }

    const result = resolveShadowBlur({
      blur: themeBlur,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should resolve theme ordinal small blur to exact value", () => {
    const smallBlur: ShadowBlurThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@blur.small",
    }

    const result = resolveShadowBlur({
      blur: smallBlur,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should resolve theme ordinal large blur to exact value", () => {
    const largeBlur: ShadowBlurThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@blur.large",
    }

    const result = resolveShadowBlur({
      blur: largeBlur,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should throw error for computed values", () => {
    const computedBlur = {
      type: ValueType.COMPUTED,
      value: {
        function: "auto_fit",
        input: { basedOn: "#parent.blur", factor: 1.5 },
      },
    }

    expect(() => {
      resolveShadowBlur({
        blur: computedBlur as ShadowBlurValue,
        theme: testTheme,
      })
    }).toThrow("Invalid blur type computed")
  })

  it("should throw error for non-existent theme values", () => {
    const invalidThemeBlur = {
      type: ValueType.THEME_ORDINAL,
      value: "@blur.nonexistent",
    }

    expect(() => {
      resolveShadowBlur({
        blur: invalidThemeBlur as ShadowBlurValue,
        theme: testTheme,
      })
    }).toThrow("Theme value @blur.nonexistent not found")
  })

  it("should throw error for invalid blur types", () => {
    const invalidBlur = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveShadowBlur({
        blur: invalidBlur as ShadowBlurValue,
        theme: testTheme,
      })
    }).toThrow("Invalid blur type INVALID")
  })
})
