import { describe, expect, it } from "bun:test"
import { ComputedFunction, Unit, ValueType } from "../../index"
import { SizeThemeValue } from "../../properties/values/appearance/size"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import { PixelValue } from "../../properties/values/shared/pixel"
import { RemValue } from "../../properties/values/shared/rem"
import testTheme from "../../themes/test/test-theme"
import { resolveSize } from "./resolve-size"

describe("resolveSize", () => {
  it("should return exact pixel size values unchanged", () => {
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

  it("should return exact rem size values unchanged", () => {
    const exactSize: RemValue = {
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 1.5 },
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

  it("should resolve theme ordinal medium size to exact value", () => {
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

  it("should resolve theme ordinal large size to exact value", () => {
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

  it("should resolve theme ordinal small size to exact value", () => {
    const themeSize: SizeThemeValue = {
      type: ValueType.THEME_ORDINAL,
      value: "@size.small",
    }

    const result = resolveSize({
      size: themeSize,
      parentContext: null,
      theme: testTheme,
    })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toEqual({ unit: Unit.REM, value: 0.75 })
  })

  it("should throw error for computed values", () => {
    const computedSize = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.AUTO_FIT,
        input: { basedOn: "#parent.size", factor: 1.5 },
      },
    }

    expect(() => {
      resolveSize({
        size: computedSize as any,
        parentContext: null,
        theme: testTheme,
      })
    }).toThrow(
      "resolveSize received a COMPUTED value. This should have been computed in the compute function.",
    )
  })

  it("should throw error for non-existent theme values", () => {
    const invalidThemeSize = {
      type: ValueType.THEME_ORDINAL,
      value: "@size.nonexistent",
    }

    expect(() => {
      resolveSize({
        size: invalidThemeSize as SizeThemeValue,
        parentContext: null,
        theme: testTheme,
      })
    }).toThrow("Theme value @size.nonexistent not found")
  })

  it("should throw error for invalid size types", () => {
    const invalidSize = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveSize({
        size: invalidSize as any,
        parentContext: null,
        theme: testTheme,
      })
    }).toThrow("Invalid size type INVALID")
  })
})
