import { describe, expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import {
  createSubPropertyLabel,
  formatHSLColor,
  formatPropertyLabel,
  getActualPropertyName,
  getFriendlyThemeValueName,
  getPropertyPlaceholder,
  getValueType,
  isHSLColorObject,
  isHSLString,
  isValueEmpty,
  parseHSLString,
} from "./shared-utils"

describe("shared-utils", () => {
  describe("getFriendlyThemeValueName", () => {
    it("should return friendly theme value name", () => {
      const result = getFriendlyThemeValueName("@margin.tight", testTheme)
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    })

    it("should handle theme value with different sections", () => {
      const result = getFriendlyThemeValueName("@fontSize.medium", testTheme)
      expect(typeof result).toBe("string")
    })
  })

  describe("getActualPropertyName", () => {
    it("should extract property name from simple key", () => {
      expect(getActualPropertyName("color")).toBe("color")
      expect(getActualPropertyName("fontSize")).toBe("fontSize")
    })

    it("should extract property name from compound key", () => {
      expect(getActualPropertyName("border.width")).toBe("width")
      expect(getActualPropertyName("background.color")).toBe("color")
      expect(getActualPropertyName("font.size")).toBe("size")
    })

    it("should handle nested compound keys", () => {
      expect(getActualPropertyName("border.width.preset")).toBe("preset")
    })
  })

  describe("getPropertyPlaceholder", () => {
    it("should return 'Default' for empty values", () => {
      expect(
        getPropertyPlaceholder(
          { value: { type: ValueType.EMPTY, value: null } },
          "Enter value",
        ),
      ).toBe("Default")

      expect(getPropertyPlaceholder({ value: null }, "Enter value")).toBe(
        "Default",
      )

      expect(getPropertyPlaceholder({ value: undefined }, "Enter value")).toBe(
        "Default",
      )
    })

    it("should return default placeholder for non-empty values", () => {
      expect(
        getPropertyPlaceholder(
          { value: { type: ValueType.EXACT, value: "test" } },
          "Enter value",
        ),
      ).toBe("Enter value")

      expect(getPropertyPlaceholder({ value: "test" }, "Enter value")).toBe(
        "Enter value",
      )
    })
  })

  describe("formatPropertyLabel", () => {
    it("should format camelCase property names", () => {
      expect(formatPropertyLabel("fontSize")).toBe("Font Size")
      expect(formatPropertyLabel("backgroundColor")).toBe("Background Color")
      expect(formatPropertyLabel("borderWidth")).toBe("Border Width")
    })

    it("should handle single word properties", () => {
      expect(formatPropertyLabel("color")).toBe("Color")
      expect(formatPropertyLabel("opacity")).toBe("Opacity")
    })

    it("should handle properties with multiple capitals", () => {
      expect(formatPropertyLabel("fontSizeLarge")).toBe("Font Size Large")
    })
  })

  describe("createSubPropertyLabel", () => {
    it("should create simplified sub-property labels", () => {
      expect(createSubPropertyLabel("margin", "top", "Margin Top")).toBe("Top")

      expect(createSubPropertyLabel("border", "style", "Border Style")).toBe(
        "Style",
      )

      expect(
        createSubPropertyLabel("background", "color", "Background Color"),
      ).toBe("Color")
    })

    it("should handle plural parent properties", () => {
      expect(
        createSubPropertyLabel("corners", "topLeft", "Corners Top Left"),
      ).toBe("Corners Top Left")
    })

    it("should fall back to formatted sub-property key when no registry label", () => {
      expect(createSubPropertyLabel("margin", "top")).toBe("Top")
      expect(createSubPropertyLabel("border", "style")).toBe("Style")
    })

    it("should handle empty registry label", () => {
      expect(createSubPropertyLabel("margin", "top", "")).toBe("Top")
      expect(createSubPropertyLabel("margin", "top", "   ")).toBe("Top")
    })

    it("should clean up multiple spaces", () => {
      expect(createSubPropertyLabel("margin", "top", "Margin  Top")).toBe("Top")
    })
  })

  describe("getValueType", () => {
    it("should extract value type from property value", () => {
      expect(getValueType({ type: ValueType.EXACT, value: "test" })).toBe(
        ValueType.EXACT,
      )

      expect(
        getValueType({
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        }),
      ).toBe(ValueType.THEME_CATEGORICAL)

      expect(getValueType({ type: ValueType.EMPTY, value: null })).toBe(
        ValueType.EMPTY,
      )
    })

    it("should return EMPTY for non-object values", () => {
      expect(getValueType("test")).toBe(ValueType.EMPTY)
      expect(getValueType(123)).toBe(ValueType.EMPTY)
      expect(getValueType(null)).toBe(ValueType.EMPTY)
      expect(getValueType(undefined)).toBe(ValueType.EMPTY)
    })

    it("should return EMPTY for objects without type property", () => {
      expect(getValueType({ value: "test" })).toBe(ValueType.EMPTY)
      expect(getValueType({})).toBe(ValueType.EMPTY)
    })
  })

  describe("isValueEmpty", () => {
    it("should identify empty values", () => {
      expect(isValueEmpty(null)).toBe(true)
      expect(isValueEmpty(undefined)).toBe(true)
      expect(isValueEmpty({ type: ValueType.EMPTY, value: null })).toBe(true)
    })

    it("should identify non-empty values", () => {
      expect(isValueEmpty("test")).toBe(false)
      expect(isValueEmpty(123)).toBe(false)
      expect(isValueEmpty({ type: ValueType.EXACT, value: "test" })).toBe(false)
    })

    it("should handle falsy but non-empty values", () => {
      expect(isValueEmpty(0)).toBe(true)
      expect(isValueEmpty("")).toBe(true)
      expect(isValueEmpty(false)).toBe(true)
    })
  })

  describe("formatHSLColor", () => {
    it("should format valid HSL color objects", () => {
      expect(formatHSLColor({ hue: 120, saturation: 100, lightness: 50 })).toBe(
        "hsl(120 100% 50%)",
      )

      expect(formatHSLColor({ hue: 0, saturation: 0, lightness: 0 })).toBe(
        "hsl(0 0% 0%)",
      )

      expect(
        formatHSLColor({ hue: 360, saturation: 100, lightness: 100 }),
      ).toBe("hsl(360 100% 100%)")
    })

    it("should return 'Invalid color' for invalid objects", () => {
      expect(formatHSLColor({ hue: 120 })).toBe("Invalid color")
      expect(formatHSLColor({ saturation: 100, lightness: 50 })).toBe(
        "Invalid color",
      )
      expect(formatHSLColor("not an object")).toBe("Invalid color")
      expect(formatHSLColor(null)).toBe("Invalid color")
    })
  })

  describe("isHSLColorObject", () => {
    it("should identify valid HSL color objects", () => {
      expect(
        isHSLColorObject({ hue: 120, saturation: 100, lightness: 50 }),
      ).toBe(true)

      expect(isHSLColorObject({ hue: 0, saturation: 0, lightness: 0 })).toBe(
        true,
      )
    })

    it("should reject invalid objects", () => {
      expect(isHSLColorObject({ hue: 120 })).toBe(false)
      expect(isHSLColorObject({ saturation: 100, lightness: 50 })).toBe(false)
      expect(isHSLColorObject("not an object")).toBe(false)
      expect(isHSLColorObject(null)).toBe(false)
      expect(isHSLColorObject({})).toBe(false)
    })
  })

  describe("parseHSLString", () => {
    it("should parse valid HSL strings", () => {
      expect(parseHSLString("hsl(120, 100%, 50%)")).toEqual({
        hue: 120,
        saturation: 100,
        lightness: 50,
      })

      expect(parseHSLString("hsl(120deg, 100%, 50%)")).toEqual({
        hue: 120,
        saturation: 100,
        lightness: 50,
      })

      expect(parseHSLString("hsl(120 100% 50%)")).toEqual({
        hue: 120,
        saturation: 100,
        lightness: 50,
      })

      expect(parseHSLString("hsl(120deg 100% 50%)")).toEqual({
        hue: 120,
        saturation: 100,
        lightness: 50,
      })

      expect(parseHSLString("hsl(0 0% 0%)")).toEqual({
        hue: 0,
        saturation: 0,
        lightness: 0,
      })
    })

    it("should reject invalid HSL strings", () => {
      expect(parseHSLString("hsl(400, 100%, 50%)")).toBeNull()
      expect(parseHSLString("hsl(120, 150%, 50%)")).toBeNull()
      expect(parseHSLString("hsl(120, 100%, 150%)")).toBeNull()
      expect(parseHSLString("rgb(255, 0, 0)")).toBeNull()
      expect(parseHSLString("invalid")).toBeNull()
      expect(parseHSLString("")).toBeNull()
    })

    it("should handle edge cases", () => {
      expect(parseHSLString("hsl(360, 100%, 100%)")).toEqual({
        hue: 360,
        saturation: 100,
        lightness: 100,
      })

      expect(parseHSLString("hsl(0, 0%, 0%)")).toEqual({
        hue: 0,
        saturation: 0,
        lightness: 0,
      })
    })
  })

  describe("isHSLString", () => {
    it("should identify valid HSL strings", () => {
      expect(isHSLString("hsl(120, 100%, 50%)")).toBe(true)
      expect(isHSLString("hsl(120deg, 100%, 50%)")).toBe(true)
      expect(isHSLString("hsl(120 100% 50%)")).toBe(true)
      expect(isHSLString("hsl(120deg 100% 50%)")).toBe(true)
      expect(isHSLString("hsl(0 0% 0%)")).toBe(true)
    })

    it("should reject invalid strings", () => {
      expect(isHSLString("rgb(255, 0, 0)")).toBe(false)
      expect(isHSLString("#ff0000")).toBe(false)
      expect(isHSLString("invalid")).toBe(false)
      expect(isHSLString("")).toBe(false)
      expect(isHSLString("hsl(400, 100%, 50%)")).toBe(true)
    })
  })
})
