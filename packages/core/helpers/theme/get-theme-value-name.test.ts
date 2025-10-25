import { describe, expect, it } from "bun:test"
import testTheme from "../../themes/test/test-theme"
import { Theme } from "../../themes/types"
import { getThemeValueName } from "./get-theme-value-name"

describe("getThemeValueName", () => {
  const theme: Theme = testTheme

  describe("theme value keys with @ prefix", () => {
    it("should return name from fontSize theme values", () => {
      expect(getThemeValueName("@fontSize.medium", theme)).toBe("Medium")
      expect(getThemeValueName("@fontSize.large", theme)).toBe("Large")
      expect(getThemeValueName("@fontSize.small", theme)).toBe("Small")
    })

    it("should return name from size theme values", () => {
      expect(getThemeValueName("@size.medium", theme)).toBe("Medium")
      expect(getThemeValueName("@size.large", theme)).toBe("Large")
      expect(getThemeValueName("@size.small", theme)).toBe("Small")
    })

    it("should return name from margin theme values", () => {
      expect(getThemeValueName("@margin.comfortable", theme)).toBe(
        "Comfortable",
      )
      expect(getThemeValueName("@margin.cozy", theme)).toBe("Cozy")
      expect(getThemeValueName("@margin.tight", theme)).toBe("Tight")
    })

    it("should return name from padding theme values", () => {
      expect(getThemeValueName("@padding.comfortable", theme)).toBe(
        "Comfortable",
      )
      expect(getThemeValueName("@padding.cozy", theme)).toBe("Cozy")
      expect(getThemeValueName("@padding.tight", theme)).toBe("Tight")
    })

    it("should return name from gap theme values", () => {
      expect(getThemeValueName("@gap.comfortable", theme)).toBe("Comfortable")
      expect(getThemeValueName("@gap.cozy", theme)).toBe("Cozy")
      expect(getThemeValueName("@gap.tight", theme)).toBe("Tight")
    })

    it("should return name from swatch theme values", () => {
      expect(getThemeValueName("@swatch.primary", theme)).toBe("Primary")
      expect(getThemeValueName("@swatch.background", theme)).toBe("Background")
      expect(getThemeValueName("@swatch.custom1", theme)).toBe("Seldon Red")
    })

    it("should return name from fontWeight theme values", () => {
      expect(getThemeValueName("@fontWeight.normal", theme)).toBe("Normal")
      expect(getThemeValueName("@fontWeight.bold", theme)).toBe("Bold")
      expect(getThemeValueName("@fontWeight.light", theme)).toBe("Light")
    })

    it("should return name from lineHeight theme values", () => {
      expect(getThemeValueName("@lineHeight.normal", theme)).toBe("Normal")
      expect(getThemeValueName("@lineHeight.tight", theme)).toBe("Tight")
      expect(getThemeValueName("@lineHeight.relaxed", theme)).toBe("Relaxed")
    })

    it("should return name from corners theme values", () => {
      expect(getThemeValueName("@corners.medium", theme)).toBe("Medium")
      expect(getThemeValueName("@corners.small", theme)).toBe("Small")
      expect(getThemeValueName("@corners.large", theme)).toBe("Large")
    })

    it("should return name from borderWidth theme values", () => {
      expect(getThemeValueName("@borderWidth.medium", theme)).toBe("Medium")
      expect(getThemeValueName("@borderWidth.thin", theme)).toBe("Thin")
      expect(getThemeValueName("@borderWidth.thick", theme)).toBe("Thick")
    })
  })

  describe("fontFamily theme values", () => {
    it("should return font family string directly", () => {
      expect(getThemeValueName("@fontFamily.primary", theme)).toBe("Inter")
      expect(getThemeValueName("@fontFamily.secondary", theme)).toBe("Inter")
    })
  })

  describe("raw value names without @ prefix", () => {
    it("should format basic value names", () => {
      expect(getThemeValueName("medium", theme)).toBe("Medium")
      expect(getThemeValueName("large", theme)).toBe("Large")
      expect(getThemeValueName("small", theme)).toBe("Small")
      expect(getThemeValueName("primary", theme)).toBe("Primary")
      expect(getThemeValueName("secondary", theme)).toBe("Secondary")
    })

    it("should handle custom swatches", () => {
      expect(getThemeValueName("custom1", theme)).toBe("Custom 1")
      expect(getThemeValueName("custom2", theme)).toBe("Custom 2")
      expect(getThemeValueName("custom3", theme)).toBe("Custom 3")
      expect(getThemeValueName("custom4", theme)).toBe("Custom 4")
      expect(getThemeValueName("custom5", theme)).toBe("Custom 5")
    })

    it("should handle camelCase values", () => {
      expect(getThemeValueName("fontSize", theme)).toBe("FontSize")
      expect(getThemeValueName("lineHeight", theme)).toBe("LineHeight")
      expect(getThemeValueName("borderWidth", theme)).toBe("BorderWidth")
    })
  })

  describe("edge cases and error handling", () => {
    it("should handle invalid theme value keys gracefully", () => {
      expect(getThemeValueName("@invalid.section", theme)).toBe("Section")
      expect(getThemeValueName("@fontSize.invalid", theme)).toBe("Invalid")
    })

    it("should handle empty strings", () => {
      expect(getThemeValueName("", theme)).toBe("")
    })

    it("should handle malformed theme keys", () => {
      expect(getThemeValueName("@", theme)).toBe("@")
      expect(getThemeValueName("@fontSize", theme)).toBe("@fontSize")
      expect(getThemeValueName("fontSize.", theme)).toBe("FontSize.")
    })

    it("should handle custom swatches with numbers", () => {
      expect(getThemeValueName("custom10", theme)).toBe("Custom 10")
      expect(getThemeValueName("custom123", theme)).toBe("Custom 123")
    })
  })

  describe("all theme sections coverage", () => {
    it("should handle dimension theme values", () => {
      expect(getThemeValueName("@dimension.medium", theme)).toBe("Medium")
      expect(getThemeValueName("@dimension.large", theme)).toBe("Large")
    })

    it("should handle shadow theme values", () => {
      expect(getThemeValueName("@shadow.medium", theme)).toBe("Medium")
      expect(getThemeValueName("@shadow.large", theme)).toBe("Large")
    })

    it("should handle gradient theme values", () => {
      expect(getThemeValueName("@gradient.primary", theme)).toBe("Default")
    })

    it("should handle background theme values", () => {
      expect(getThemeValueName("@background.primary", theme)).toBe("Color fill")
    })

    it("should handle blur theme values", () => {
      expect(getThemeValueName("@blur.medium", theme)).toBe("Medium")
    })

    it("should handle spread theme values", () => {
      expect(getThemeValueName("@spread.medium", theme)).toBe("Medium")
    })

    it("should handle border theme values", () => {
      expect(getThemeValueName("@border.primary", theme)).toBe("Primary")
    })

    it("should handle scrollbar theme values", () => {
      expect(getThemeValueName("@scrollbar.primary", theme)).toBe("Primary")
    })
  })
})
