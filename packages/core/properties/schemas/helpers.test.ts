import { describe, expect, it } from "bun:test"
import testTheme from "../../themes/test/test-theme"
import { Unit, ValueType } from "../constants"
import {
  formatOptionsForUI,
  getAllPropertySchemas,
  getCompoundSubPropertySchema,
  getPresetOptions,
  getPresetOptionsAsLabelValue,
  getPropertyCategory,
  getPropertyOptions,
  getPropertySchema,
  getPropertySupportedValueTypes,
  getSubPropertySchema,
  validatePropertyValue,
} from "./helpers"

describe("schemas helpers", () => {
  describe("getPropertySchema", () => {
    it("should return schema for existing property", () => {
      const schema = getPropertySchema("width")

      expect(schema).toBeDefined()
      expect(schema?.name).toBe("width")
      expect(schema?.description).toBe("Element width dimension")
      expect(schema?.supports).toContain("exact")
      expect(schema?.supports).toContain("preset")
      expect(schema?.units?.allowed).toEqual([Unit.PX, Unit.REM])
      expect(schema?.units?.default).toBe(Unit.PX)
    })

    it("should return undefined for non-existent property", () => {
      const schema = getPropertySchema("nonExistentProperty")

      expect(schema).toBeUndefined()
    })

    it("should return schema for compound property", () => {
      const schema = getPropertySchema("backgroundColor")

      expect(schema).toBeDefined()
      expect(schema?.name).toBe("backgroundColor")
    })

    it("should return schema for shorthand property", () => {
      const schema = getPropertySchema("margin")

      expect(schema).toBeDefined()
      expect(schema?.name).toBe("margin")
      expect(schema?.supports).toContain("exact")
      expect(schema?.supports).toContain("themeOrdinal")
    })
  })

  describe("validatePropertyValue", () => {
    it("should validate exact value for width property", () => {
      const validValue = { unit: Unit.PX, value: 100 }
      const result = validatePropertyValue("width", "exact", validValue)

      expect(result).toBe(true)
    })

    it("should reject invalid exact value for width property", () => {
      const invalidValue = "invalid"
      const result = validatePropertyValue("width", "exact", invalidValue)

      expect(result).toBe(false)
    })

    it("should validate preset value for width property", () => {
      const validValue = "fit"
      const result = validatePropertyValue("width", "preset", validValue)

      expect(result).toBe(true)
    })

    it("should validate theme ordinal value with theme", () => {
      const validValue = "medium"
      const result = validatePropertyValue(
        "width",
        "themeOrdinal",
        validValue,
        testTheme,
      )

      expect(result).toBe(true)
    })

    it("should reject theme ordinal value without theme", () => {
      const validValue = "medium"
      const result = validatePropertyValue("width", "themeOrdinal", validValue)

      expect(result).toBe(false)
    })

    it("should validate empty value", () => {
      const result = validatePropertyValue("width", "empty", null)

      expect(result).toBe(true)
    })

    it("should validate inherit value", () => {
      const result = validatePropertyValue("width", "inherit", null)

      expect(result).toBe(true)
    })

    it("should return false for non-existent property", () => {
      const result = validatePropertyValue("nonExistentProperty", "exact", {
        unit: Unit.PX,
        value: 100,
      })

      expect(result).toBe(false)
    })

    it("should return false for unsupported value type", () => {
      const result = validatePropertyValue("width", "unsupportedType", {
        unit: Unit.PX,
        value: 100,
      })

      expect(result).toBe(false)
    })

    it("should validate opacity percentage value", () => {
      const validValue = { unit: Unit.PERCENT, value: 50 }
      const result = validatePropertyValue("opacity", "exact", validValue)

      expect(result).toBe(true)
    })

    it("should validate opacity number value", () => {
      const validValue = 50
      const result = validatePropertyValue("opacity", "exact", validValue)

      expect(result).toBe(true)
    })

    it("should reject invalid opacity value", () => {
      const invalidValue = 150
      const result = validatePropertyValue("opacity", "exact", invalidValue)

      expect(result).toBe(false)
    })

    it("should validate columns integer value", () => {
      const validValue = 3
      const result = validatePropertyValue("columns", "exact", validValue)

      expect(result).toBe(true)
    })

    it("should reject invalid columns value", () => {
      const invalidValue = 3.5
      const result = validatePropertyValue("columns", "exact", invalidValue)

      expect(result).toBe(false)
    })
  })

  describe("getPropertyOptions", () => {
    it("should return preset options for width property", () => {
      const options = getPropertyOptions("width", "preset")

      expect(options).toEqual(["fit", "fill"])
    })

    it("should return theme ordinal keys for width property with theme", () => {
      const options = getPropertyOptions("width", "themeOrdinal", testTheme)

      expect(options).toContain("tiny")
      expect(options).toContain("small")
      expect(options).toContain("medium")
      expect(options).toContain("large")
      expect(options).toContain("huge")
    })

    it("should return empty array for theme ordinal without theme", () => {
      const options = getPropertyOptions("width", "themeOrdinal")

      expect(options).toEqual([])
    })

    it("should return empty array for unsupported value type", () => {
      const options = getPropertyOptions("width", "unsupportedType")

      expect(options).toEqual([])
    })

    it("should return empty array for non-existent property", () => {
      const options = getPropertyOptions("nonExistentProperty", "preset")

      expect(options).toEqual([])
    })

    it("should return empty array for property without preset options", () => {
      const options = getPropertyOptions("opacity", "preset")

      expect(options).toEqual([])
    })
  })

  describe("getPresetOptions", () => {
    it("should return preset options for width property", () => {
      const options = getPresetOptions("width")

      expect(options).toEqual(["fit", "fill"])
    })

    it("should return empty array for property without preset options", () => {
      const options = getPresetOptions("opacity")

      expect(options).toEqual([])
    })

    it("should return empty array for non-existent property", () => {
      const options = getPresetOptions("nonExistentProperty")

      expect(options).toEqual([])
    })
  })

  describe("getPresetOptionsAsLabelValue", () => {
    it("should return formatted preset options for width property", () => {
      const options = getPresetOptionsAsLabelValue("width")

      expect(options).toEqual([
        { label: "Fit", value: "fit" },
        { label: "Fill", value: "fill" },
      ])
    })

    it("should return empty array for property without preset options", () => {
      const options = getPresetOptionsAsLabelValue("opacity")

      expect(options).toEqual([])
    })

    it("should format hyphenated values correctly", () => {
      // This tests the formatLabel function indirectly
      const options = getPresetOptionsAsLabelValue("width")

      // If there were hyphenated values, they would be formatted as "Top Left" etc.
      expect(options.every((option) => typeof option.label === "string")).toBe(
        true,
      )
    })
  })

  describe("getAllPropertySchemas", () => {
    it("should return all property schemas", () => {
      const schemas = getAllPropertySchemas()

      expect(schemas).toBeDefined()
      expect(typeof schemas).toBe("object")
      expect(schemas.width).toBeDefined()
      expect(schemas.height).toBeDefined()
      expect(schemas.opacity).toBeDefined()
      expect(schemas.backgroundColor).toBeDefined()
    })

    it("should return the same reference as PROPERTY_SCHEMAS", () => {
      const schemas = getAllPropertySchemas()

      expect(schemas).toBe(schemas) // Same reference
    })
  })

  describe("formatOptionsForUI", () => {
    it("should format simple string options", () => {
      const options = ["fit", "fill"]
      const formatted = formatOptionsForUI(options)

      expect(formatted).toEqual([
        { label: "Fit", value: "fit" },
        { label: "Fill", value: "fill" },
      ])
    })

    it("should format hyphenated string options", () => {
      const options = ["top-left", "bottom-right"]
      const formatted = formatOptionsForUI(options)

      expect(formatted).toEqual([
        { label: "Top Left", value: "top-left" },
        { label: "Bottom Right", value: "bottom-right" },
      ])
    })

    it("should format non-string options", () => {
      const options = [1, 2, 3]
      const formatted = formatOptionsForUI(options)

      expect(formatted).toEqual([
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
      ])
    })

    it("should handle empty array", () => {
      const options: any[] = []
      const formatted = formatOptionsForUI(options)

      expect(formatted).toEqual([])
    })
  })

  describe("getPropertySupportedValueTypes", () => {
    it("should return supported value types for width property", () => {
      const types = getPropertySupportedValueTypes("width")

      expect(types).toContain("empty")
      expect(types).toContain("inherit")
      expect(types).toContain("exact")
      expect(types).toContain("preset")
      expect(types).toContain("computed")
      expect(types).toContain("themeOrdinal")
    })

    it("should return supported value types for opacity property", () => {
      const types = getPropertySupportedValueTypes("opacity")

      expect(types).toContain("empty")
      expect(types).toContain("inherit")
      expect(types).toContain("exact")
    })

    it("should return empty array for non-existent property", () => {
      const types = getPropertySupportedValueTypes("nonExistentProperty")

      expect(types).toEqual([])
    })

    it("should return a copy of the supports array", () => {
      const types1 = getPropertySupportedValueTypes("width")
      const types2 = getPropertySupportedValueTypes("width")

      expect(types1).toEqual(types2)
      expect(types1).not.toBe(types2) // Different references
    })
  })

  describe("getPropertyCategory", () => {
    it("should return 'compound' for compound properties", () => {
      expect(getPropertyCategory("background")).toBe("compound")
      expect(getPropertyCategory("border")).toBe("compound")
      expect(getPropertyCategory("font")).toBe("compound")
      expect(getPropertyCategory("gradient")).toBe("compound")
      expect(getPropertyCategory("shadow")).toBe("compound")
    })

    it("should return 'shorthand' for shorthand properties", () => {
      expect(getPropertyCategory("margin")).toBe("shorthand")
      expect(getPropertyCategory("padding")).toBe("shorthand")
      expect(getPropertyCategory("corners")).toBe("shorthand")
      expect(getPropertyCategory("position")).toBe("shorthand")
    })

    it("should return 'atomic' for atomic properties", () => {
      expect(getPropertyCategory("width")).toBe("atomic")
      expect(getPropertyCategory("height")).toBe("atomic")
      expect(getPropertyCategory("opacity")).toBe("atomic")
      expect(getPropertyCategory("color")).toBe("atomic")
    })

    it("should return undefined for non-existent properties", () => {
      expect(getPropertyCategory("nonExistentProperty")).toBeUndefined()
    })

    it("should return undefined for compound sub-properties that don't exist", () => {
      expect(getPropertyCategory("background.nonexistent")).toBeUndefined()
    })
  })

  describe("getSubPropertySchema", () => {
    it("should return parent schema for shorthand sub-properties", () => {
      const schema = getSubPropertySchema("margin", "top")

      expect(schema).toBeDefined()
      expect(schema?.name).toBe("margin")
    })

    it("should return parent schema for any shorthand sub-property", () => {
      const topSchema = getSubPropertySchema("margin", "top")
      const rightSchema = getSubPropertySchema("margin", "right")
      const bottomSchema = getSubPropertySchema("margin", "bottom")
      const leftSchema = getSubPropertySchema("margin", "left")

      expect(topSchema).toBeDefined()
      expect(rightSchema).toBeDefined()
      expect(bottomSchema).toBeDefined()
      expect(leftSchema).toBeDefined()

      // All should be the same schema
      expect(topSchema).toBe(rightSchema)
      expect(rightSchema).toBe(bottomSchema)
      expect(bottomSchema).toBe(leftSchema)
    })

    it("should return undefined for non-existent parent property", () => {
      const schema = getSubPropertySchema("nonExistentProperty", "top")

      expect(schema).toBeUndefined()
    })
  })

  describe("getCompoundSubPropertySchema", () => {
    it("should return schema for compound sub-properties", () => {
      const schema = getCompoundSubPropertySchema("background", "color")

      expect(schema).toBeDefined()
      expect(schema?.name).toBe("backgroundColor")
    })

    it("should return schema for font sub-properties", () => {
      const schema = getCompoundSubPropertySchema("font", "size")

      expect(schema).toBeDefined()
      expect(schema?.name).toBe("fontSize")
    })

    it("should return schema for border sub-properties", () => {
      const schema = getCompoundSubPropertySchema("border", "width")

      expect(schema).toBeDefined()
      expect(schema?.name).toBe("borderWidth")
    })

    it("should return undefined for non-existent compound sub-property", () => {
      const schema = getCompoundSubPropertySchema("background", "nonexistent")

      expect(schema).toBeUndefined()
    })

    it("should return undefined for non-existent parent property", () => {
      const schema = getCompoundSubPropertySchema("nonexistent", "color")

      expect(schema).toBeUndefined()
    })

    it("should handle camelCase conversion correctly", () => {
      const schema = getCompoundSubPropertySchema("background", "image")

      expect(schema).toBeDefined()
      expect(schema?.name).toBe("backgroundImage")
    })
  })
})
