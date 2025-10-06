import { describe, expect, it } from "bun:test"
import { ShadowSpreadValue, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getShadowSpreadCSSValue } from "./get-shadow-spread-css-value"

describe("getShadowSpreadCSSValue", () => {
  it("should return CSS value for exact spread with pixels", () => {
    const spread: ShadowSpreadValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 4 },
    }

    const result = getShadowSpreadCSSValue({
      spread,
      theme: testTheme,
    })

    expect(result).toBe("4px")
  })

  it("should return CSS value for exact spread with rem", () => {
    const spread: ShadowSpreadValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.25 },
    }

    const result = getShadowSpreadCSSValue({
      spread,
      theme: testTheme,
    })

    expect(result).toBe("0.25rem")
  })

  it("should return CSS value for theme ordinal spread", () => {
    const spread: ShadowSpreadValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@spread.medium",
    }

    const result = getShadowSpreadCSSValue({
      spread,
      theme: testTheme,
    })

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain("rem")
  })

  it("should handle zero spread values", () => {
    const spread: ShadowSpreadValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 0 },
    }

    const result = getShadowSpreadCSSValue({
      spread,
      theme: testTheme,
    })

    expect(result).toBe("0px")
  })

  it("should handle negative spread values", () => {
    const spread: ShadowSpreadValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: -2 },
    }

    const result = getShadowSpreadCSSValue({
      spread,
      theme: testTheme,
    })

    expect(result).toBe("-2px")
  })

  it("should handle different theme spread values", () => {
    const spread: ShadowSpreadValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@spread.large",
    }

    const result = getShadowSpreadCSSValue({
      spread,
      theme: testTheme,
    })

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain("rem")
  })

  it("should handle decimal spread values", () => {
    const spread: ShadowSpreadValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 2.5 },
    }

    const result = getShadowSpreadCSSValue({
      spread,
      theme: testTheme,
    })

    expect(result).toBe("2.5px")
  })

  it("should handle large spread values", () => {
    const spread: ShadowSpreadValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 20 },
    }

    const result = getShadowSpreadCSSValue({
      spread,
      theme: testTheme,
    })

    expect(result).toBe("20px")
  })

  it("should throw error for invalid spread type", () => {
    const invalidSpread = {
      type: "invalid" as ValueType,
      value: { unit: Unit.PX, value: 4 },
    }

    expect(() => {
      getShadowSpreadCSSValue({
        spread: invalidSpread as ShadowSpreadValue,
        theme: testTheme,
      })
    }).toThrow()
  })
})
