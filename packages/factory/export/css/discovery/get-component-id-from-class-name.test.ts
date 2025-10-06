import { describe, expect, it } from "bun:test"
import { getComponentIdFromClassName } from "./get-component-id-from-class-name"

describe("getComponentIdFromClassName", () => {
  it("should extract component ID from class name", () => {
    const result = getComponentIdFromClassName("sdn-button-primary")
    expect(result).toBe("sdn-button")
  })

  it("should handle class names with multiple parts", () => {
    const result = getComponentIdFromClassName("sdn-card-product-featured")
    expect(result).toBe("sdn-card-product")
  })

  it("should handle class names with single part", () => {
    const result = getComponentIdFromClassName("sdn-button")
    expect(result).toBe("sdn")
  })

  it("should handle class names with no dashes", () => {
    const result = getComponentIdFromClassName("button")
    expect(result).toBe("")
  })

  it("should handle empty string", () => {
    const result = getComponentIdFromClassName("")
    expect(result).toBe("")
  })

  it("should handle class names with single dash", () => {
    const result = getComponentIdFromClassName("sdn-button")
    expect(result).toBe("sdn")
  })

  it("should handle class names with many dashes", () => {
    const result = getComponentIdFromClassName(
      "sdn-card-product-featured-variant",
    )
    expect(result).toBe("sdn-card-product-featured")
  })

  it("should handle class names ending with dash", () => {
    const result = getComponentIdFromClassName("sdn-button-")
    expect(result).toBe("sdn-button")
  })

  it("should handle class names starting with dash", () => {
    const result = getComponentIdFromClassName("-button-primary")
    expect(result).toBe("-button")
  })

  it("should handle class names with numbers", () => {
    const result = getComponentIdFromClassName("sdn-button-123")
    expect(result).toBe("sdn-button")
  })

  it("should handle class names with mixed alphanumeric", () => {
    const result = getComponentIdFromClassName("sdn-button-abc123")
    expect(result).toBe("sdn-button")
  })
})
