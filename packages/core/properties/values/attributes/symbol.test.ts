import { describe, expect, it } from "bun:test"
import { IconId, iconIds, iconLabels } from "../../../components/icons"
import { ValueType } from "../../../constants"
import testTheme from "../../../themes/test/test-theme"
import { symbolSchema } from "./symbol"

describe("symbolSchema", () => {
  describe("presetOptions", () => {
    it("should return all available icon options", () => {
      const options = symbolSchema.presetOptions?.(testTheme)

      expect(options).toBeDefined()
      expect(Array.isArray(options)).toBe(true)
      expect(options!.length).toBeGreaterThan(0)

      // Check that all iconIds are included
      iconIds.forEach((iconId) => {
        const option = options!.find((opt) => opt.value === iconId)
        expect(option).toBeDefined()
        expect(option!.name).toBe(iconLabels[iconId])
      })
    })

    it("should return options in correct format", () => {
      const options = symbolSchema.presetOptions?.(testTheme)

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

    it("should include common icon types", () => {
      const options = symbolSchema.presetOptions?.(testTheme)

      expect(options).toBeDefined()

      // Check for some common icon types
      const commonIcons = [
        "arrow-right",
        "arrow-left",
        "check",
        "close",
        "menu",
        "search",
      ]
      commonIcons.forEach((iconId) => {
        if (iconIds.includes(iconId as IconId)) {
          const option = options!.find((opt) => opt.value === iconId)
          expect(option).toBeDefined()
        }
      })
    })
  })

  describe("validation", () => {
    it("should validate empty values", () => {
      expect(symbolSchema.validation.empty()).toBe(true)
    })

    it("should validate inherit values", () => {
      expect(symbolSchema.validation.inherit()).toBe(true)
    })

    it("should validate exact string values", () => {
      expect(symbolSchema.validation.exact("arrow-right")).toBe(true)
      expect(symbolSchema.validation.exact("custom-icon")).toBe(true)
    })

    it("should reject invalid exact values", () => {
      expect(symbolSchema.validation.exact("")).toBe(false)
      expect(symbolSchema.validation.exact(null)).toBe(false)
      expect(symbolSchema.validation.exact(undefined)).toBe(false)
      expect(symbolSchema.validation.exact(123)).toBe(false)
    })

    it("should validate preset values", () => {
      expect(symbolSchema.validation.preset("arrow-right")).toBe(true)
      expect(symbolSchema.validation.preset("check")).toBe(true)
    })

    it("should reject invalid preset values", () => {
      expect(symbolSchema.validation.preset("")).toBe(false)
      expect(symbolSchema.validation.preset(null)).toBe(false)
      expect(symbolSchema.validation.preset(undefined)).toBe(false)
      expect(symbolSchema.validation.preset(123)).toBe(false)
    })
  })

  describe("supports", () => {
    it("should support correct value types", () => {
      expect(symbolSchema.supports).toContain("empty")
      expect(symbolSchema.supports).toContain("inherit")
      expect(symbolSchema.supports).toContain("exact")
      expect(symbolSchema.supports).toContain("preset")
    })
  })
})
