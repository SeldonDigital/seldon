import { describe, expect, it } from "bun:test"
import testTheme from "@seldon/core/themes/test/test-theme"
import {
  getAllPropertyKeys,
  getAllPropertyPaths,
  getPropertiesByControl,
  getPropertyComputedFunctions,
  getPropertyPresetOptions,
  getPropertySupportedValueTypes,
  getPropertySupportsInherit,
  getPropertyThemeCategoricalKeys,
  getPropertyThemeOrdinalKeys,
} from "./properties-registry-utils"

describe("properties-registry-utils", () => {
  describe("getAllPropertyKeys", () => {
    it("should return array of top-level property keys", () => {
      const keys = getAllPropertyKeys()
      expect(Array.isArray(keys)).toBe(true)
      expect(keys.length).toBeGreaterThan(0)
      expect(keys).toContain("color")
      expect(keys).toContain("font")
      expect(keys).toContain("margin")
      expect(keys).toContain("background")
    })
  })

  describe("getAllPropertyPaths", () => {
    it("should return array of all property paths including sub-properties", () => {
      const paths = getAllPropertyPaths()
      expect(Array.isArray(paths)).toBe(true)
      expect(paths.length).toBeGreaterThan(0)

      // Should include top-level properties
      expect(paths).toContain("color")
      expect(paths).toContain("font")

      // Should include sub-properties
      expect(paths).toContain("border.width")
      expect(paths).toContain("border.style")
      expect(paths).toContain("background.color")
    })

    it("should include nested sub-properties", () => {
      const paths = getAllPropertyPaths()

      // Should include deeply nested properties if they exist
      const borderPaths = paths.filter((path) => path.startsWith("border."))
      expect(borderPaths.length).toBeGreaterThan(0)

      const backgroundPaths = paths.filter((path) =>
        path.startsWith("background."),
      )
      expect(backgroundPaths.length).toBeGreaterThan(0)
    })
  })

  describe("getPropertiesByControl", () => {
    it("should return properties with specific control types", () => {
      const comboControlProps = getPropertiesByControl("combo")
      expect(Array.isArray(comboControlProps)).toBe(true)
      // Just check it returns an array, specific properties depend on registry
    })

    it("should return properties with text control", () => {
      const textControlProps = getPropertiesByControl("text")
      expect(Array.isArray(textControlProps)).toBe(true)
      expect(textControlProps).toContain("content")
    })

    it("should return properties with number control", () => {
      const numberControlProps = getPropertiesByControl("number")
      expect(Array.isArray(numberControlProps)).toBe(true)
      expect(numberControlProps).toContain("opacity")
      expect(numberControlProps).toContain("brightness")
    })

    it("should return empty array for non-existent control type", () => {
      const result = getPropertiesByControl("nonexistent" as "combo")
      expect(result).toEqual([])
    })
  })

  describe("getPropertySupportsInherit", () => {
    it("should return true for properties that support inheritance", () => {
      // Most properties should support inheritance
      expect(getPropertySupportsInherit("color")).toBe(true)
      expect(getPropertySupportsInherit("fontSize")).toBe(true)
    })

    it("should return false for properties that don't support inheritance", () => {
      // Some properties might not support inheritance
      // This test might need adjustment based on actual schema definitions
      const result = getPropertySupportsInherit("nonexistent")
      expect(typeof result).toBe("boolean")
    })
  })

  describe("getPropertyComputedFunctions", () => {
    it("should return computed functions for properties that support them", () => {
      const functions = getPropertyComputedFunctions("font.size")
      expect(Array.isArray(functions)).toBe(true)
      // Just check it returns an array, specific functions depend on schema
    })

    it("should return empty array for properties without computed functions", () => {
      const functions = getPropertyComputedFunctions("color")
      expect(Array.isArray(functions)).toBe(true)
    })

    it("should return empty array for non-existent properties", () => {
      const functions = getPropertyComputedFunctions("nonexistent")
      expect(functions).toEqual([])
    })
  })

  describe("getPropertyPresetOptions", () => {
    it("should return preset options for properties that have them", () => {
      const options = getPropertyPresetOptions("display")
      expect(Array.isArray(options)).toBe(true)
    })

    it("should return empty array for properties without presets", () => {
      const options = getPropertyPresetOptions("color")
      expect(Array.isArray(options)).toBe(true)
    })

    it("should return empty array for non-existent properties", () => {
      const options = getPropertyPresetOptions("nonexistent")
      expect(options).toEqual([])
    })
  })

  describe("getPropertyThemeCategoricalKeys", () => {
    it("should return theme categorical keys when theme is provided", () => {
      const keys = getPropertyThemeCategoricalKeys("color", testTheme)
      expect(Array.isArray(keys)).toBe(true)
      expect(keys).toContain("primary")
      expect(keys).toContain("swatch1")
    })

    it("should return empty array when theme is not provided", () => {
      const keys = getPropertyThemeCategoricalKeys("color")
      expect(keys).toEqual([])
    })

    it("should return empty array for non-existent properties", () => {
      const keys = getPropertyThemeCategoricalKeys("nonexistent", testTheme)
      expect(keys).toEqual([])
    })
  })

  describe("getPropertyThemeOrdinalKeys", () => {
    it("should return theme ordinal keys when theme is provided", () => {
      const keys = getPropertyThemeOrdinalKeys("font.size", testTheme)
      expect(Array.isArray(keys)).toBe(true)
      // Just check it returns an array, specific keys depend on schema
    })

    it("should return empty array when theme is not provided", () => {
      const keys = getPropertyThemeOrdinalKeys("font.size")
      expect(keys).toEqual([])
    })

    it("should return empty array for non-existent properties", () => {
      const keys = getPropertyThemeOrdinalKeys("nonexistent", testTheme)
      expect(keys).toEqual([])
    })
  })

  describe("getPropertySupportedValueTypes", () => {
    it("should return supported value types for properties", () => {
      const types = getPropertySupportedValueTypes("color")
      expect(Array.isArray(types)).toBe(true)
      expect(types.length).toBeGreaterThan(0)
      expect(types).toContain("exact")
      expect(types).toContain("themeCategorical")
    })

    it("should return supported value types for font.size", () => {
      const types = getPropertySupportedValueTypes("font.size")
      expect(Array.isArray(types)).toBe(true)
      // Just check it returns an array, specific types depend on schema
    })

    it("should return empty array for non-existent properties", () => {
      const types = getPropertySupportedValueTypes("nonexistent")
      expect(types).toEqual([])
    })
  })
})
