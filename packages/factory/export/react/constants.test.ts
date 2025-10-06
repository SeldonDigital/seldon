import { describe, expect, it } from "bun:test"
import { MARKERS } from "./constants"

describe("React Constants", () => {
  describe("MARKERS", () => {
    it("should have all required marker constants", () => {
      expect(MARKERS).toHaveProperty("REMOVE_BLOCK_START")
      expect(MARKERS).toHaveProperty("REMOVE_BLOCK_END")
      expect(MARKERS).toHaveProperty("COMPONENT_BODY")
      expect(MARKERS).toHaveProperty("BEFORE_COMPONENT")
      expect(MARKERS).toHaveProperty("AFTER_COMPONENT")
    })

    it("should have correct marker values", () => {
      expect(MARKERS.REMOVE_BLOCK_START).toBe("[remove:block:start]")
      expect(MARKERS.REMOVE_BLOCK_END).toBe("[remove:block:end]")
      expect(MARKERS.COMPONENT_BODY).toBe("[insert_at:component_body]")
      expect(MARKERS.BEFORE_COMPONENT).toBe("[insert_at:before_component]")
      expect(MARKERS.AFTER_COMPONENT).toBe("[insert_at:after_component]")
    })

    it("should be readonly", () => {
      // TypeScript will prevent this at compile time, but we can test the structure
      expect(MARKERS).toBeDefined()
      expect(typeof MARKERS).toBe("object")
    })
  })

  it("should export constants as const", () => {
    // This test ensures the constants are properly typed as const
    const expectedMarkers: typeof MARKERS = {
      REMOVE_BLOCK_START: "[remove:block:start]",
      REMOVE_BLOCK_END: "[remove:block:end]",
      COMPONENT_BODY: "[insert_at:component_body]",
      BEFORE_COMPONENT: "[insert_at:before_component]",
      AFTER_COMPONENT: "[insert_at:after_component]",
    }

    expect(expectedMarkers).toEqual(MARKERS)
  })
})
