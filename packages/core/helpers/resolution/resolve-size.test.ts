import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../index"
import { SizeThemeValue } from "../../properties/values/appearance/size"
import { EmptyValue } from "../../properties/values/shared/empty"
import { PixelValue } from "../../properties/values/shared/pixel"
import { RemValue } from "../../properties/values/shared/rem"
import testTheme from "../../themes/test/test-theme"
import { resolveSize } from "./resolve-size"

describe("resolveSize", () => {
  it("should return exact size values unchanged", () => {
    const exactSize: PixelValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 100 },
    }

    const result = resolveSize({
      size: exactSize,
      parentContext: null,
      theme: testTheme,
    })
    expect(result).toEqual(exactSize)
  })

  it("should return empty values unchanged", () => {
    const emptySize: EmptyValue = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = resolveSize({
      size: emptySize,
      parentContext: null,
      theme: testTheme,
    })
    expect(result).toEqual(emptySize)
  })

  it("should resolve theme ordinal sizes", () => {
    const themeSize: SizeThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@size.medium",
    }

    const result = resolveSize({
      size: themeSize,
      parentContext: null,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toEqual({ unit: Unit.REM, value: 1 })
  })

  it("should resolve different theme ordinal sizes", () => {
    const themeSize: SizeThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@size.large",
    }

    const result = resolveSize({
      size: themeSize,
      parentContext: null,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toEqual({ unit: Unit.REM, value: 1.501 })
  })

  it("should throw error for invalid size types", () => {
    const invalidSize = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveSize({
        size: invalidSize as unknown as SizeThemeValue,
        parentContext: null,
        theme: testTheme,
      })
    }).toThrow("Invalid size type INVALID")
  })
})
