import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../index"
import {
  ShadowSpreadThemeValue,
  ShadowSpreadValue,
} from "../../properties/values/effects/shadow/shadow-spread"
import { PixelValue } from "../../properties/values/shared/pixel"
import { RemValue } from "../../properties/values/shared/rem"
import testTheme from "../../themes/test/test-theme"
import { resolveShadowSpread } from "./resolve-shadow-spread"

describe("resolveShadowSpread", () => {
  it("should return exact pixel spread values unchanged", () => {
    const exactSpread: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 2 },
    }

    const result = resolveShadowSpread({
      spread: exactSpread,
      theme: testTheme,
    })

    expect(result).toEqual(exactSpread)
  })

  it("should return exact rem spread values unchanged", () => {
    const exactSpread: RemValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.125 },
    }

    const result = resolveShadowSpread({
      spread: exactSpread,
      theme: testTheme,
    })

    expect(result).toEqual(exactSpread)
  })

  it("should resolve theme ordinal spread values to rem values", () => {
    const themeSpread: ShadowSpreadThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@spread.medium",
    }

    const result = resolveShadowSpread({
      spread: themeSpread,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should resolve different theme spread values", () => {
    const smallSpread: ShadowSpreadThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@spread.small",
    }

    const result = resolveShadowSpread({
      spread: smallSpread,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("unit", Unit.REM)
    expect(result.value).toHaveProperty("value")
  })

  it("should throw error for invalid spread types", () => {
    const invalidSpread = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveShadowSpread({
        spread: invalidSpread as unknown as ShadowSpreadValue,
        theme: testTheme,
      })
    }).toThrow("Invalid spread type INVALID")
  })
})
