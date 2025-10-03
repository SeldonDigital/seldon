import { describe, expect, it } from "bun:test"
import { ColorValue, ValueType } from "../../index"
import { Color } from "../../properties/constants/colors"
import { HexValue } from "../../properties/values/color/hex"
import { HSLValue } from "../../properties/values/color/hsl"
import { LCHValue } from "../../properties/values/color/lch"
import { RGBValue } from "../../properties/values/color/rgb"
import { ColorThemeValue } from "../../properties/values/color/theme"
import { TransparentValue } from "../../properties/values/color/transparent"
import { EmptyValue } from "../../properties/values/shared/empty"
import testTheme from "../../themes/test/test-theme"
import { resolveColor } from "./resolve-color"

describe("resolveColor", () => {
  it("should return exact color values unchanged", () => {
    const exactColor: HexValue = {
      type: ValueType.EXACT,
      value: "#ff0000",
    }

    const result = resolveColor({ color: exactColor, theme: testTheme })

    expect(result).toEqual(exactColor)
  })

  it("should return empty values unchanged", () => {
    const emptyColor: EmptyValue = {
      type: ValueType.EMPTY,
      value: null,
    }

    const result = resolveColor({ color: emptyColor, theme: testTheme })

    expect(result).toEqual(emptyColor)
  })

  it("should return preset values unchanged", () => {
    const presetColor: TransparentValue = {
      type: ValueType.PRESET,
      value: Color.TRANSPARENT,
    }

    const result = resolveColor({ color: presetColor, theme: testTheme })

    expect(result).toEqual(presetColor)
  })

  it("should resolve theme categorical colors to exact values", () => {
    const themeColor: ColorThemeValue = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    }

    const result = resolveColor({ color: themeColor, theme: testTheme })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toBe(testTheme.swatch.primary.value)
  })

  it("should throw error for computed values", () => {
    const computedColor = {
      type: ValueType.COMPUTED,
      value: {
        function: "auto_fit",
        input: { basedOn: "#parent.color", factor: 1.5 },
      },
    }

    expect(() => {
      resolveColor({ color: computedColor as ColorValue, theme: testTheme })
    }).toThrow("resolveColor received a COMPUTED value")
  })

  it("should throw error for non-existent theme values", () => {
    const invalidThemeColor = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.nonexistent",
    }

    expect(() => {
      resolveColor({ color: invalidThemeColor as ColorValue, theme: testTheme })
    }).toThrow("Theme value @swatch.nonexistent not found")
  })

  it("should throw error for invalid color types", () => {
    const invalidColor = {
      type: "INVALID",
      value: "invalid",
    }

    expect(() => {
      resolveColor({ color: invalidColor as ColorValue, theme: testTheme })
    }).toThrow("Invalid color type INVALID")
  })
})
