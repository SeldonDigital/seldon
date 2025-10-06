import { describe, expect, it } from "bun:test"
import { getClassNameForNodeId } from "./get-class-name"

describe("getClassNameForNodeId", () => {
  it("should generate class name for variant ID", () => {
    const result = getClassNameForNodeId("variant-button-primary")
    expect(result).toBe("sdn-button-primary")
  })

  it("should generate class name for child instance ID", () => {
    const result = getClassNameForNodeId("child-button-instance-123")
    expect(result).toBe("sdn-button-instance-123")
  })

  it("should remove variant- prefix", () => {
    const result = getClassNameForNodeId("variant-cardProduct-featured")
    expect(result).toBe("sdn-card-product-featured")
  })

  it("should remove child- prefix", () => {
    const result = getClassNameForNodeId("child-icon-arrow")
    expect(result).toBe("sdn-icon-arrow")
  })

  it("should remove -default suffix", () => {
    const result = getClassNameForNodeId("variant-button-default")
    expect(result).toBe("sdn-button")
  })

  it("should handle complex node IDs", () => {
    const result = getClassNameForNodeId("child-button-primary-default")
    expect(result).toBe("sdn-button-primary")
  })

  it("should handle node IDs with multiple dashes", () => {
    const result = getClassNameForNodeId("variant-cardProduct-featured")
    expect(result).toBe("sdn-card-product-featured")
  })

  it("should handle node IDs without prefixes", () => {
    const result = getClassNameForNodeId("button-primary")
    expect(result).toBe("sdn-button-primary")
  })

  it("should handle empty string", () => {
    const result = getClassNameForNodeId("")
    expect(result).toBe("sdn-")
  })

  it("should handle node ID with only prefix", () => {
    const result = getClassNameForNodeId("variant-")
    expect(result).toBe("sdn-")
  })

  it("should handle node ID with only suffix", () => {
    const result = getClassNameForNodeId("-default")
    expect(result).toBe("sdn-")
  })
})
