import { describe, expect, it } from "bun:test"
import {
  ColorValue,
  EmptyValue,
  HSLValue,
  HexValue,
  LCHValue,
  RGBValue,
  ValueType,
} from "../../index"
import { Color } from "../../properties"
import { ColorThemeValue } from "../../properties/values/appearance/color"
import { TransparentValue } from "../../properties/values/shared/exact/transparent"
import testTheme from "../../themes/test/test-theme"
import { resolveColor } from "./resolve-color"

describe("resolveColor", () => {
  it("should return exact hex color values unchanged", () => {
    const exactColor: HexValue = {
      type: ValueType.EXACT,
      value: "#ff0000",
    }

    const result = resolveColor({ color: exactColor, theme: testTheme })

    expect(result).toEqual(exactColor)
  })

  it("should return exact HSL color values unchanged", () => {
    const exactColor: HSLValue = {
      type: ValueType.EXACT,
      value: { hue: 0, saturation: 100, lightness: 50 },
    }

    const result = resolveColor({ color: exactColor, theme: testTheme })

    expect(result).toEqual(exactColor)
  })

  it("should return exact RGB color values unchanged", () => {
    const exactColor: RGBValue = {
      type: ValueType.EXACT,
      value: { red: 255, green: 0, blue: 0 },
    }

    const result = resolveColor({ color: exactColor, theme: testTheme })

    expect(result).toEqual(exactColor)
  })

  it("should return exact LCH color values unchanged", () => {
    const exactColor: LCHValue = {
      type: ValueType.EXACT,
      value: { lightness: 50, chroma: 100, hue: 0 },
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

  it("should return preset transparent values unchanged", () => {
    const presetColor: TransparentValue = {
      type: ValueType.PRESET,
      value: Color.TRANSPARENT,
    }

    const result = resolveColor({ color: presetColor, theme: testTheme })

    expect(result).toEqual(presetColor)
  })

  it("should resolve theme categorical primary color to exact value", () => {
    const themeColor: ColorThemeValue = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    }

    const result = resolveColor({ color: themeColor, theme: testTheme })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toBe(testTheme.swatch.primary.value)
  })

  it("should resolve theme categorical custom1 color to exact value", () => {
    const themeColor: ColorThemeValue = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.custom1",
    }

    const result = resolveColor({ color: themeColor, theme: testTheme })

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toBe(testTheme.swatch.custom1.value)
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
    }).toThrow(
      "resolveColor received a COMPUTED value. This should have been computed in the compute function.",
    )
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

  it("should return empty value for invalid color types", () => {
    const invalidColor = {
      type: "INVALID",
      value: "invalid",
    }

    const result = resolveColor({
      color: invalidColor as ColorValue,
      theme: testTheme,
    })
    expect(result).toEqual({ type: ValueType.EMPTY, value: null })
  })
})
