import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import testTheme from "@seldon/core/themes/test/test-theme"
import { generatePropertyOptions } from "./options-utils"

describe("options-utils", () => {
  describe("generatePropertyOptions", () => {
    it("should generate options for a simple property", () => {
      const property = {
        key: "color",
        value: { type: "exact", value: "#ff0000" },
        allowedValues: undefined,
      }

      const result = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
      expect(result.options.length).toBeGreaterThan(0)
    })

    it("should generate options for a preset property", () => {
      const property = {
        key: "border.preset",
        value: { type: "preset", value: "medium" },
        allowedValues: undefined,
      }

      const result = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
    })

    it("should generate options for a property with allowed values", () => {
      const property = {
        key: "display",
        value: { type: "preset", value: "block" },
        allowedValues: ["block", "inline", "flex"],
      }

      const result = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
    })

    it("should handle properties without theme", () => {
      const property = {
        key: "color",
        value: { type: "exact", value: "#ff0000" },
        allowedValues: undefined,
      }

      const result = generatePropertyOptions(
        property,
        undefined,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
    })

    it("should handle properties without component context", () => {
      const property = {
        key: "color",
        value: { type: "exact", value: "#ff0000" },
        allowedValues: undefined,
      }

      const result = generatePropertyOptions(property, testTheme)

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
    })

    it("should return error options for invalid property schemas", () => {
      const property = {
        key: "nonexistent.preset",
        value: { type: "preset", value: "test" },
        allowedValues: undefined,
      }

      const result = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
      expect(result.options.length).toBeGreaterThan(0)
      expect(result.options[0]).toContainEqual({
        value: "",
        name: "Error",
      })
    })

    it("should handle different component levels", () => {
      const property = {
        key: "fontSize",
        value: { type: "exact", value: 16 },
        allowedValues: undefined,
      }

      const primitiveResult = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.LABEL,
        ComponentLevel.PRIMITIVE,
      )

      const elementResult = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(primitiveResult).toHaveProperty("options")
      expect(elementResult).toHaveProperty("options")
      expect(Array.isArray(primitiveResult.options)).toBe(true)
      expect(Array.isArray(elementResult.options)).toBe(true)
    })

    it("should handle empty property values", () => {
      const property = {
        key: "color",
        value: { type: "empty", value: null },
        allowedValues: undefined,
      }

      const result = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
    })

    it("should handle theme categorical properties", () => {
      const property = {
        key: "color",
        value: { type: "themeCategorical", value: "@swatch.primary" },
        allowedValues: undefined,
      }

      const result = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
    })

    it("should handle theme ordinal properties", () => {
      const property = {
        key: "fontSize",
        value: { type: "themeOrdinal", value: "@fontSize.medium" },
        allowedValues: undefined,
      }

      const result = generatePropertyOptions(
        property,
        testTheme,
        ComponentId.BUTTON,
        ComponentLevel.ELEMENT,
      )

      expect(result).toHaveProperty("options")
      expect(result).toHaveProperty("hasCurrentValue")
      expect(Array.isArray(result.options)).toBe(true)
    })
  })
})
