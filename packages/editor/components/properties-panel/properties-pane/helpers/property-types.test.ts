import { describe, expect, it } from "bun:test"
import {
  getParentPropertyKey,
  getSubPropertyKeys,
  isCompoundOrShorthandProperty,
  isCompoundProperty,
  isPresetProperty,
  isShorthandProperty,
  shouldUseCompoundMainPropertyBehavior,
  shouldUsePresetPropertyBehavior,
  shouldUseShorthandMainPropertyBehavior,
} from "./property-types"

describe("property-types", () => {
  describe("isShorthandProperty", () => {
    it("should identify shorthand properties", () => {
      expect(isShorthandProperty("margin")).toBe(true)
      expect(isShorthandProperty("padding")).toBe(true)
      expect(isShorthandProperty("border")).toBe(false)
    })

    it("should reject non-shorthand properties", () => {
      expect(isShorthandProperty("color")).toBe(false)
      expect(isShorthandProperty("fontSize")).toBe(false)
      expect(isShorthandProperty("background")).toBe(false)
    })
  })

  describe("isCompoundProperty", () => {
    it("should identify compound properties", () => {
      expect(isCompoundProperty("background")).toBe(true)
      expect(isCompoundProperty("border")).toBe(true)
      expect(isCompoundProperty("font")).toBe(true)
    })

    it("should reject non-compound properties", () => {
      expect(isCompoundProperty("color")).toBe(false)
      expect(isCompoundProperty("fontSize")).toBe(false)
      expect(isCompoundProperty("margin")).toBe(false)
    })
  })

  describe("isPresetProperty", () => {
    it("should identify preset properties", () => {
      expect(isPresetProperty("border.preset")).toBe(true)
      expect(isPresetProperty("background.preset")).toBe(true)
      expect(isPresetProperty("font.preset")).toBe(true)
    })

    it("should reject non-preset properties", () => {
      expect(isPresetProperty("border")).toBe(false)
      expect(isPresetProperty("background.color")).toBe(false)
      expect(isPresetProperty("font.size")).toBe(false)
      expect(isPresetProperty("color")).toBe(false)
    })
  })

  describe("isCompoundOrShorthandProperty", () => {
    it("should identify compound properties", () => {
      expect(isCompoundOrShorthandProperty("background")).toBe(true)
      expect(isCompoundOrShorthandProperty("border")).toBe(true)
      expect(isCompoundOrShorthandProperty("font")).toBe(true)
    })

    it("should identify shorthand properties", () => {
      expect(isCompoundOrShorthandProperty("margin")).toBe(true)
      expect(isCompoundOrShorthandProperty("padding")).toBe(true)
    })

    it("should reject atomic properties", () => {
      expect(isCompoundOrShorthandProperty("color")).toBe(false)
      expect(isCompoundOrShorthandProperty("fontSize")).toBe(false)
      expect(isCompoundOrShorthandProperty("opacity")).toBe(false)
    })
  })

  describe("getSubPropertyKeys", () => {
    it("should return sub-property keys for compound properties", () => {
      const borderKeys = getSubPropertyKeys("border")
      expect(Array.isArray(borderKeys)).toBe(true)
      expect(borderKeys.length).toBeGreaterThan(0)
      expect(borderKeys).toContain("width")
      expect(borderKeys).toContain("style")
      expect(borderKeys).toContain("color")
    })

    it("should return sub-property keys for background", () => {
      const backgroundKeys = getSubPropertyKeys("background")
      expect(Array.isArray(backgroundKeys)).toBe(true)
      expect(backgroundKeys.length).toBeGreaterThan(0)
      expect(backgroundKeys).toContain("color")
    })

    it("should return empty array for atomic properties", () => {
      expect(getSubPropertyKeys("color")).toEqual([])
      expect(getSubPropertyKeys("fontSize")).toEqual([])
    })

    it("should return empty array for non-existent properties", () => {
      expect(getSubPropertyKeys("nonexistent")).toEqual([])
    })
  })

  describe("getParentPropertyKey", () => {
    it("should extract parent property key from preset property", () => {
      expect(getParentPropertyKey("border.preset")).toBe("border")
      expect(getParentPropertyKey("background.preset")).toBe("background")
      expect(getParentPropertyKey("font.preset")).toBe("font")
    })

    it("should handle nested preset properties", () => {
      expect(getParentPropertyKey("border.width.preset")).toBe("border.width")
    })

    it("should return original key if not a preset property", () => {
      expect(getParentPropertyKey("border")).toBe("border")
      expect(getParentPropertyKey("color")).toBe("color")
    })
  })

  describe("shouldUseShorthandMainPropertyBehavior", () => {
    it("should return true for shorthand properties", () => {
      expect(shouldUseShorthandMainPropertyBehavior("margin")).toBe(true)
      expect(shouldUseShorthandMainPropertyBehavior("padding")).toBe(true)
    })

    it("should return false for non-shorthand properties", () => {
      expect(shouldUseShorthandMainPropertyBehavior("color")).toBe(false)
      expect(shouldUseShorthandMainPropertyBehavior("background")).toBe(false)
    })
  })

  describe("shouldUsePresetPropertyBehavior", () => {
    it("should return true for preset properties", () => {
      expect(shouldUsePresetPropertyBehavior("border.preset")).toBe(true)
      expect(shouldUsePresetPropertyBehavior("background.preset")).toBe(true)
    })

    it("should return false for non-preset properties", () => {
      expect(shouldUsePresetPropertyBehavior("border")).toBe(false)
      expect(shouldUsePresetPropertyBehavior("color")).toBe(false)
    })
  })

  describe("shouldUseCompoundMainPropertyBehavior", () => {
    it("should return true for compound properties", () => {
      expect(shouldUseCompoundMainPropertyBehavior("background")).toBe(true)
      expect(shouldUseCompoundMainPropertyBehavior("border")).toBe(true)
      expect(shouldUseCompoundMainPropertyBehavior("font")).toBe(true)
    })

    it("should return false for non-compound properties", () => {
      expect(shouldUseCompoundMainPropertyBehavior("color")).toBe(false)
      expect(shouldUseCompoundMainPropertyBehavior("margin")).toBe(false)
    })
  })
})
