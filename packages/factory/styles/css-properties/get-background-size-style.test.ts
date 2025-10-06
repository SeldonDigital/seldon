import { describe, expect, it } from "bun:test"
import { ImageFit, Unit, ValueType } from "@seldon/core"
import {
  ImageFitValue,
  PercentageValue,
  PixelValue,
  RemValue,
} from "@seldon/core/properties/values"
import { getBackgroundSizeStyle } from "./get-background-size-style"

describe("getBackgroundSizeStyle", () => {
  describe("exact value types", () => {
    it("should return CSS value for exact size with pixels", () => {
      const size: PixelValue = {
        type: ValueType.EXACT,
        value: { value: 100, unit: Unit.PX },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("100px")
    })

    it("should return CSS value for exact size with percentage", () => {
      const size: PercentageValue = {
        type: ValueType.EXACT,
        value: { value: 50, unit: Unit.PERCENT },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("50%")
    })

    it("should return CSS value for exact size with rem", () => {
      const size: RemValue = {
        type: ValueType.EXACT,
        value: { value: 2, unit: Unit.REM },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("2rem")
    })

    it("should handle zero values correctly", () => {
      const size: PixelValue = {
        type: ValueType.EXACT,
        value: { value: 0, unit: Unit.PX },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("0px")
    })

    it("should handle decimal values correctly", () => {
      const size: PercentageValue = {
        type: ValueType.EXACT,
        value: { value: 75.5, unit: Unit.PERCENT },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("75.5%")
    })

    it("should handle negative values correctly", () => {
      const size: PixelValue = {
        type: ValueType.EXACT,
        value: { value: -10, unit: Unit.PX },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("-10px")
    })

    it("should handle large values correctly", () => {
      const size: PixelValue = {
        type: ValueType.EXACT,
        value: { value: 9999, unit: Unit.PX },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("9999px")
    })
  })

  describe("preset value types", () => {
    it("should return correct CSS value for all ImageFit preset values", () => {
      const expectedMappings = [
        { preset: ImageFit.ORIGINAL, css: "auto" },
        { preset: ImageFit.CONTAIN, css: "contain" },
        { preset: ImageFit.COVER, css: "cover" },
        { preset: ImageFit.STRETCH, css: "100% 100%" },
      ]

      for (const mapping of expectedMappings) {
        const size: ImageFitValue = {
          type: ValueType.PRESET,
          value: mapping.preset,
        }

        const result = getBackgroundSizeStyle(size)

        expect(result).toBe(mapping.css)
      }
    })

    it("should return valid CSS strings for all preset values", () => {
      const allPresets = Object.values(ImageFit)

      for (const preset of allPresets) {
        const size: ImageFitValue = {
          type: ValueType.PRESET,
          value: preset,
        }

        const result = getBackgroundSizeStyle(size)

        expect(result).toBeDefined()
        expect(typeof result).toBe("string")
        expect((result as string).length).toBeGreaterThan(0)
        expect((result as string).trim()).toBe(result as string) // No leading/trailing whitespace
      }
    })
  })

  describe("edge cases and boundary conditions", () => {
    it("should handle very small decimal values", () => {
      const size: PixelValue = {
        type: ValueType.EXACT,
        value: { value: 0.1, unit: Unit.PX },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("0.1px")
    })

    it("should handle very large values", () => {
      const size: PercentageValue = {
        type: ValueType.EXACT,
        value: { value: 999999, unit: Unit.PERCENT },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("999999%")
    })

    it("should handle fractional rem values", () => {
      const size: RemValue = {
        type: ValueType.EXACT,
        value: { value: 1.25, unit: Unit.REM },
      }

      const result = getBackgroundSizeStyle(size)

      expect(result).toBe("1.25rem")
    })
  })

  describe("comprehensive validation", () => {
    it("should maintain consistent behavior across all supported units", () => {
      const testValue = 50

      // Test PixelValue
      const pixelSize: PixelValue = {
        type: ValueType.EXACT,
        value: { value: testValue, unit: Unit.PX },
      }
      expect(getBackgroundSizeStyle(pixelSize)).toBe("50px")

      // Test PercentageValue
      const percentageSize: PercentageValue = {
        type: ValueType.EXACT,
        value: { value: testValue, unit: Unit.PERCENT },
      }
      expect(getBackgroundSizeStyle(percentageSize)).toBe("50%")

      // Test RemValue
      const remSize: RemValue = {
        type: ValueType.EXACT,
        value: { value: testValue, unit: Unit.REM },
      }
      expect(getBackgroundSizeStyle(remSize)).toBe("50rem")
    })

    it("should handle all ImageFit enum values without errors", () => {
      const allImageFitValues = Object.values(ImageFit)

      for (const imageFit of allImageFitValues) {
        const size: ImageFitValue = {
          type: ValueType.PRESET,
          value: imageFit,
        }

        expect(() => {
          const result = getBackgroundSizeStyle(size)
          expect(result).toBeDefined()
        }).not.toThrow()
      }
    })
  })
})
