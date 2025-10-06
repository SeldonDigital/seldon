import { describe, expect, it } from "bun:test"
import { BackgroundPosition } from "@seldon/core"
import { backgroundPositionMap } from "./background-position-map"

describe("backgroundPositionMap", () => {
  it("should map all background position enum values to correct CSS values", () => {
    // Test all enum values with their expected CSS mappings
    const expectedMappings = [
      { enum: BackgroundPosition.DEFAULT, css: "auto" },
      { enum: BackgroundPosition.TOP_LEFT, css: "top left" },
      { enum: BackgroundPosition.TOP_CENTER, css: "top center" },
      { enum: BackgroundPosition.TOP_RIGHT, css: "top right" },
      { enum: BackgroundPosition.CENTER_LEFT, css: "left center" },
      { enum: BackgroundPosition.CENTER, css: "center" },
      { enum: BackgroundPosition.CENTER_RIGHT, css: "right center" },
      { enum: BackgroundPosition.BOTTOM_LEFT, css: "left bottom" },
      { enum: BackgroundPosition.BOTTOM_CENTER, css: "center bottom" },
      { enum: BackgroundPosition.BOTTOM_RIGHT, css: "right bottom" },
    ]

    for (const mapping of expectedMappings) {
      expect(backgroundPositionMap[mapping.enum]).toBe(mapping.css)
    }
  })

  it("should have complete coverage of all BackgroundPosition enum values", () => {
    const enumValues = Object.values(BackgroundPosition)
    const mapKeys = Object.keys(backgroundPositionMap)

    // Verify the map has the same number of entries as the enum
    expect(mapKeys).toHaveLength(enumValues.length)

    // Verify every enum value has a corresponding map entry
    for (const enumValue of enumValues) {
      expect(backgroundPositionMap).toHaveProperty(enumValue)
      expect(backgroundPositionMap[enumValue]).toBeDefined()
    }
  })

  it("should return valid CSS background-position values for all mappings", () => {
    const values = Object.values(backgroundPositionMap) as string[]

    // Verify all values are valid CSS strings
    for (const value of values) {
      expect(typeof value).toBe("string")
      expect(value.length).toBeGreaterThan(0)
      expect(value.trim()).toBe(value) // No leading/trailing whitespace
    }
  })

  it("should maintain consistent mapping structure", () => {
    const enumValues = Object.values(BackgroundPosition)
    const mapEntries = Object.entries(backgroundPositionMap)

    // Verify map structure consistency
    expect(mapEntries.length).toBe(enumValues.length)

    // Verify all map keys are valid enum values
    for (const [key, value] of mapEntries) {
      expect(enumValues).toContain(key as BackgroundPosition)
      expect(typeof value).toBe("string")
    }
  })

  it("should handle edge cases correctly", () => {
    // Test that the map doesn't have unexpected properties
    const mapKeys = Object.keys(backgroundPositionMap)
    const enumValues = Object.values(BackgroundPosition)

    // Every key in the map should be a valid enum value
    for (const key of mapKeys) {
      expect(enumValues).toContain(key as BackgroundPosition)
    }

    // No extra keys beyond enum values
    expect(
      mapKeys.every((key) => enumValues.includes(key as BackgroundPosition)),
    ).toBe(true)
  })
})
