import { describe, expect, it } from "bun:test"
import testTheme from "../../../../themes/test/test-theme"
import { GOOGLE_FONT_FAMILIES, ValueType } from "../../../constants"
import { fontFamilySchema } from "./font-family"

describe("fontFamilySchema", () => {
  describe("presetOptions", () => {
    it("should return theme font families with descriptive names", () => {
      const options = fontFamilySchema.presetOptions?.(testTheme)

      expect(options).toBeDefined()
      expect(Array.isArray(options)).toBe(true)
      expect(options!.length).toBeGreaterThan(0)

      // Check that theme font families are included with descriptive names
      const primaryOption = options!.find(
        (opt) =>
          opt.value === "@fontFamily.primary" && opt.name.includes("(Primary)"),
      )
      const secondaryOption = options!.find(
        (opt) =>
          opt.value === "@fontFamily.secondary" &&
          opt.name.includes("(Secondary)"),
      )

      expect(primaryOption).toBeDefined()
      expect(primaryOption!.name).toBe(
        `${testTheme.fontFamily.primary} (Primary)`,
      )

      expect(secondaryOption).toBeDefined()
      expect(secondaryOption!.name).toBe(
        `${testTheme.fontFamily.secondary} (Secondary)`,
      )
    })

    it("should include all Google Font families", () => {
      const options = fontFamilySchema.presetOptions?.(testTheme)

      expect(options).toBeDefined()

      // Check that all Google Font families are included
      GOOGLE_FONT_FAMILIES.forEach((googleFont) => {
        const option = options!.find((opt) => opt.value === googleFont.family)
        expect(option).toBeDefined()
        expect(option!.name).toBe(googleFont.family)
      })
    })

    it("should return options in correct format", () => {
      const options = fontFamilySchema.presetOptions?.(testTheme)

      expect(options).toBeDefined()
      options!.forEach((option) => {
        expect(option).toHaveProperty("value")
        expect(option).toHaveProperty("name")
        expect(typeof option.value).toBe("string")
        expect(typeof option.name).toBe("string")
        expect(option.value.length).toBeGreaterThan(0)
        expect(option.name.length).toBeGreaterThan(0)
      })
    })

    it("should include common Google Fonts", () => {
      const options = fontFamilySchema.presetOptions?.(testTheme)

      expect(options).toBeDefined()

      // Check for some common Google Fonts that should be in the list
      const commonFonts = ["Abel", "Anton", "Barlow", "Crimson Text", "DM Sans"]
      commonFonts.forEach((fontFamily) => {
        const option = options!.find((opt) => opt.value === fontFamily)
        expect(option).toBeDefined()
      })
    })

    it("should handle missing theme gracefully", () => {
      const options = fontFamilySchema.presetOptions?.()

      expect(options).toBeDefined()
      expect(Array.isArray(options)).toBe(true)

      // Should still include Google Fonts even without theme
      expect(options!.length).toBeGreaterThan(0)
      expect(options!.some((opt) => opt.value === "Inter")).toBe(true)
    })
  })

  describe("themeCategoricalKeys", () => {
    it("should return theme font family keys", () => {
      const keys = fontFamilySchema.themeCategoricalKeys?.(testTheme)

      expect(keys).toBeDefined()
      expect(Array.isArray(keys)).toBe(true)
      expect(keys).toContain("primary")
      expect(keys).toContain("secondary")
    })
  })

  describe("validation", () => {
    it("should validate empty values", () => {
      expect(fontFamilySchema.validation.empty()).toBe(true)
    })

    it("should validate inherit values", () => {
      expect(fontFamilySchema.validation.inherit()).toBe(true)
    })

    it("should validate exact string values", () => {
      expect(fontFamilySchema.validation.exact("Arial, sans-serif")).toBe(true)
      expect(fontFamilySchema.validation.exact("Inter")).toBe(true)
    })

    it("should reject invalid exact values", () => {
      expect(fontFamilySchema.validation.exact("")).toBe(false)
      expect(fontFamilySchema.validation.exact(null)).toBe(false)
      expect(fontFamilySchema.validation.exact(undefined)).toBe(false)
      expect(fontFamilySchema.validation.exact(123)).toBe(false)
    })

    it("should validate preset values", () => {
      expect(fontFamilySchema.validation.preset("Arial, sans-serif")).toBe(true)
      expect(fontFamilySchema.validation.preset("Inter")).toBe(true)
    })

    it("should reject invalid preset values", () => {
      expect(fontFamilySchema.validation.preset("")).toBe(false)
      expect(fontFamilySchema.validation.preset(null)).toBe(false)
      expect(fontFamilySchema.validation.preset(undefined)).toBe(false)
      expect(fontFamilySchema.validation.preset(123)).toBe(false)
    })

    it("should validate theme categorical values with theme", () => {
      // The validation function checks if the key exists in theme.fontFamily
      expect(
        fontFamilySchema.validation.themeCategorical("primary", testTheme),
      ).toBe(true)
      expect(
        fontFamilySchema.validation.themeCategorical("secondary", testTheme),
      ).toBe(true)
    })

    it("should reject theme categorical values without theme", () => {
      expect(fontFamilySchema.validation.themeCategorical("primary")).toBe(
        false,
      )
    })

    it("should reject invalid theme categorical values", () => {
      expect(
        fontFamilySchema.validation.themeCategorical("nonexistent", testTheme),
      ).toBe(false)
      expect(
        fontFamilySchema.validation.themeCategorical("invalid", testTheme),
      ).toBe(false)
    })
  })

  describe("supports", () => {
    it("should support correct value types", () => {
      expect(fontFamilySchema.supports).toContain("empty")
      expect(fontFamilySchema.supports).toContain("inherit")
      expect(fontFamilySchema.supports).toContain("exact")
      expect(fontFamilySchema.supports).toContain("preset")
      expect(fontFamilySchema.supports).toContain("themeCategorical")
    })
  })
})
