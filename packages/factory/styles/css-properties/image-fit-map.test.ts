import { describe, expect, it } from "bun:test"
import { ImageFit } from "@seldon/core"
import { backgroundSizeMap, objectFitMap } from "./image-fit-map"

describe("image-fit-map", () => {
  describe("objectFitMap", () => {
    it("should map all image fit values to CSS object-fit values", () => {
      expect(objectFitMap.original).toBe("none")
      expect(objectFitMap.contain).toBe("contain")
      expect(objectFitMap.cover).toBe("cover")
      expect(objectFitMap.stretch).toBe("fill")
    })

    it("should have all image fit enum values mapped", () => {
      const enumValues = Object.values(ImageFit)
      const mapKeys = Object.keys(objectFitMap)

      expect(mapKeys).toHaveLength(enumValues.length)

      for (const enumValue of enumValues) {
        expect(objectFitMap).toHaveProperty(enumValue)
      }
    })

    it("should return valid CSS object-fit values", () => {
      const values = Object.values(objectFitMap)

      for (const value of values) {
        expect(typeof value).toBe("string")
        expect(value.length).toBeGreaterThan(0)
      }
    })
  })

  describe("backgroundSizeMap", () => {
    it("should map all image fit values to CSS background-size values", () => {
      expect(backgroundSizeMap.original).toBe("auto")
      expect(backgroundSizeMap.contain).toBe("contain")
      expect(backgroundSizeMap.cover).toBe("cover")
      expect(backgroundSizeMap.stretch).toBe("100% 100%")
    })

    it("should have all image fit enum values mapped", () => {
      const enumValues = Object.values(ImageFit)
      const mapKeys = Object.keys(backgroundSizeMap)

      expect(mapKeys).toHaveLength(enumValues.length)

      for (const enumValue of enumValues) {
        expect(backgroundSizeMap).toHaveProperty(enumValue)
      }
    })

    it("should return valid CSS background-size values", () => {
      const values = Object.values(backgroundSizeMap)

      for (const value of values) {
        expect(typeof value).toBe("string")
        if (typeof value === "string") {
          expect(value.length).toBeGreaterThan(0)
        }
      }
    })

    it("should handle all ImageFit enum values without errors", () => {
      const enumValues = Object.values(ImageFit)

      for (const enumValue of enumValues) {
        expect(() => {
          const value = backgroundSizeMap[enumValue]
          expect(value).toBeDefined()
        }).not.toThrow()
      }
    })
  })

  it("should have consistent mapping between objectFitMap and backgroundSizeMap", () => {
    const objectFitKeys = Object.keys(objectFitMap)
    const backgroundSizeKeys = Object.keys(backgroundSizeMap)

    expect(objectFitKeys).toEqual(backgroundSizeKeys)
  })

  it("should handle edge cases gracefully", () => {
    // Test that all mapped values are non-empty strings
    const allValues = [
      ...Object.values(objectFitMap),
      ...Object.values(backgroundSizeMap),
    ]

    for (const value of allValues) {
      expect(value).toBeDefined()
      expect(typeof value).toBe("string")
      expect(value).not.toBe("")
    }
  })

  it("should maintain type safety for all mappings", () => {
    // Test that all keys are valid ImageFit enum values
    const imageFitValues = Object.values(ImageFit)

    for (const key of Object.keys(objectFitMap)) {
      expect(imageFitValues).toContain(key as ImageFit)
    }

    for (const key of Object.keys(backgroundSizeMap)) {
      expect(imageFitValues).toContain(key as ImageFit)
    }
  })
})
