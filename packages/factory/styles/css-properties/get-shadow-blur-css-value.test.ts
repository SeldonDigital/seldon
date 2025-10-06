import { describe, expect, it } from "bun:test"
import { ShadowBlurValue, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getShadowBlurCSSValue } from "./get-shadow-blur-css-value"

describe("getShadowBlurCSSValue", () => {
  it("should return CSS value for exact blur with pixels", () => {
    const blur: ShadowBlurValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 8 },
    }

    const result = getShadowBlurCSSValue({
      blur,
      theme: testTheme,
    })

    expect(result).toBe("8px")
  })

  it("should return CSS value for exact blur with rem", () => {
    const blur: ShadowBlurValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.5 },
    }

    const result = getShadowBlurCSSValue({
      blur,
      theme: testTheme,
    })

    expect(result).toBe("0.5rem")
  })

  it("should return CSS value for theme ordinal blur", () => {
    const blur: ShadowBlurValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@blur.medium",
    }

    const result = getShadowBlurCSSValue({
      blur,
      theme: testTheme,
    })

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain("rem")
  })

  it("should handle zero blur values", () => {
    const blur: ShadowBlurValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 0 },
    }

    const result = getShadowBlurCSSValue({
      blur,
      theme: testTheme,
    })

    expect(result).toBe("0px")
  })

  it("should handle different theme blur values", () => {
    const blur: ShadowBlurValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@blur.large",
    }

    const result = getShadowBlurCSSValue({
      blur,
      theme: testTheme,
    })

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain("rem")
  })

  it("should handle decimal blur values", () => {
    const blur: ShadowBlurValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 2.5 },
    }

    const result = getShadowBlurCSSValue({
      blur,
      theme: testTheme,
    })

    expect(result).toBe("2.5px")
  })

  it("should handle large blur values", () => {
    const blur: ShadowBlurValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 20 },
    }

    const result = getShadowBlurCSSValue({
      blur,
      theme: testTheme,
    })

    expect(result).toBe("20px")
  })

  it("should handle negative blur values", () => {
    const blur: ShadowBlurValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: -1 },
    }

    const result = getShadowBlurCSSValue({
      blur,
      theme: testTheme,
    })

    expect(result).toBe("-1px")
  })

  it("should throw error for invalid blur type", () => {
    const invalidBlur = {
      type: "invalid" as ValueType,
      value: { unit: Unit.PX, value: 8 },
    }

    expect(() => {
      getShadowBlurCSSValue({
        blur: invalidBlur as ShadowBlurValue,
        theme: testTheme,
      })
    }).toThrow()
  })
})
