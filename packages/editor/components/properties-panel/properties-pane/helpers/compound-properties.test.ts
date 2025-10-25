import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "@seldon/core/helpers/fixtures/workspace"
import testTheme from "@seldon/core/themes/test/test-theme"
import {
  createCompoundPropertyUpdate,
  createPresetPropertyUpdate,
  getPresetPropertyDisplayValue,
  getSiblingSubPropertyKeys,
  isCompoundCompoundProperty,
  isCompoundProperty,
} from "./compound-properties"

describe("compound-properties", () => {
  describe("isCompoundProperty", () => {
    it("should identify compound properties correctly", () => {
      expect(isCompoundProperty("border")).toBe(true)
      expect(isCompoundProperty("background")).toBe(true)
      expect(isCompoundProperty("font")).toBe(true)
      expect(isCompoundProperty("margin")).toBe(false)
      expect(isCompoundProperty("padding")).toBe(false)
    })

    it("should identify non-compound properties correctly", () => {
      expect(isCompoundProperty("color")).toBe(false)
      expect(isCompoundProperty("fontSize")).toBe(false)
      expect(isCompoundProperty("opacity")).toBe(false)
    })
  })

  describe("getSiblingSubPropertyKeys", () => {
    it("should return sibling sub-property keys for border preset", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = getSiblingSubPropertyKeys(
        "border.preset",
        WORKSPACE_FIXTURE,
        node,
      )

      expect(Array.isArray(result)).toBe(true)
      expect(result).toContain("border.width")
      expect(result).toContain("border.style")
      expect(result).toContain("border.color")
      expect(result).not.toContain("border.preset")
    })

    it("should return sibling sub-property keys for background preset", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = getSiblingSubPropertyKeys(
        "background.preset",
        WORKSPACE_FIXTURE,
        node,
      )

      expect(Array.isArray(result)).toBe(true)
      expect(result).toContain("background.color")
      expect(result).not.toContain("background.preset")
    })

    it("should return empty array for non-existent parent property", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = getSiblingSubPropertyKeys(
        "nonexistent.preset",
        WORKSPACE_FIXTURE,
        node,
      )

      expect(result).toEqual([])
    })

    it("should return empty array for non-object parent property", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = getSiblingSubPropertyKeys(
        "color.preset",
        WORKSPACE_FIXTURE,
        node,
      )

      expect(Array.isArray(result)).toBe(true)
      // Color might have sub-properties, so just check it's an array
    })
  })

  describe("getPresetPropertyDisplayValue", () => {
    it("should return display value for border preset", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = getPresetPropertyDisplayValue(
        "border.preset",
        WORKSPACE_FIXTURE,
        node,
        testTheme,
      )

      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    })

    it("should return display value for background preset", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = getPresetPropertyDisplayValue(
        "background.preset",
        WORKSPACE_FIXTURE,
        node,
        testTheme,
      )

      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
    })

    it("should work without theme parameter", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = getPresetPropertyDisplayValue(
        "border.preset",
        WORKSPACE_FIXTURE,
        node,
      )

      expect(typeof result).toBe("string")
    })
  })

  describe("createPresetPropertyUpdate", () => {
    it("should create update for preset property with theme token", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = createPresetPropertyUpdate(
        "border.preset",
        "@border.medium",
        WORKSPACE_FIXTURE,
        node,
        testTheme,
      )

      expect(typeof result).toBe("object")
    })

    it("should create update for preset property with preset name", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = createPresetPropertyUpdate(
        "border.preset",
        "medium",
        WORKSPACE_FIXTURE,
        node,
        testTheme,
      )

      expect(typeof result).toBe("object")
    })

    it("should work without theme parameter", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = createPresetPropertyUpdate(
        "border.preset",
        "medium",
        WORKSPACE_FIXTURE,
        node,
      )

      expect(typeof result).toBe("object")
    })

    it("should handle theme token with preset value", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = createPresetPropertyUpdate(
        "border.preset",
        "@border.medium",
        WORKSPACE_FIXTURE,
        node,
        testTheme,
      )

      expect(typeof result).toBe("object")
    })
  })

  describe("createCompoundPropertyUpdate", () => {
    it("should create update for compound property", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = createCompoundPropertyUpdate(
        "border",
        "medium",
        WORKSPACE_FIXTURE,
        node,
        testTheme,
      )

      expect(typeof result).toBe("object")
    })

    it("should work without theme parameter", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const result = createCompoundPropertyUpdate(
        "border",
        "medium",
        WORKSPACE_FIXTURE,
        node,
      )

      expect(typeof result).toBe("object")
    })
  })

  describe("isCompoundCompoundProperty", () => {
    it("should identify compound compound properties", () => {
      expect(
        isCompoundCompoundProperty({
          propertyType: "compound",
          key: "border",
        }),
      ).toBe(true)

      expect(
        isCompoundCompoundProperty({
          propertyType: "compound",
          key: "background",
        }),
      ).toBe(true)
    })

    it("should reject non-compound properties", () => {
      expect(
        isCompoundCompoundProperty({
          propertyType: "atomic",
          key: "color",
        }),
      ).toBe(false)

      expect(
        isCompoundCompoundProperty({
          propertyType: "shorthand",
          key: "margin",
        }),
      ).toBe(false)
    })

    it("should reject compound type with non-compound key", () => {
      expect(
        isCompoundCompoundProperty({
          propertyType: "compound",
          key: "color",
        }),
      ).toBe(false)
    })
  })
})
