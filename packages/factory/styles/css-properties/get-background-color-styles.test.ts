import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getBackgroundColorStyles } from "./get-background-color-styles"

describe("getBackgroundColorStyles", () => {
  describe("when background color is not defined", () => {
    it("should return an empty object when properties are empty", () => {
      const result = getBackgroundColorStyles({
        properties: {},
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({})
    })

    it("should return an empty object when background property is not defined", () => {
      const properties: Properties = {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({})
    })

    it("should return an empty object when background.color is not defined", () => {
      const properties: Properties = {
        background: {
          opacity: {
            type: ValueType.EXACT,
            value: { value: 50, unit: Unit.PERCENT },
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({})
    })
  })

  describe("when background color is defined", () => {
    it("should return correct CSS for theme categorical color with opacity", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.black",
          },
          opacity: {
            type: ValueType.EXACT,
            value: { value: 50, unit: Unit.PERCENT },
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "hsl(0 12% 8% / 50%)",
      })
    })

    it("should return correct CSS for theme categorical color without opacity", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "hsl(0 0% 15%)",
      })
    })

    it("should return correct CSS for exact color value", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.EXACT,
            value: "#ff0000",
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "#ff0000",
      })
    })

    it("should return correct CSS for HSL color value", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.EXACT,
            value: {
              hue: 120,
              saturation: 100,
              lightness: 50,
            },
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "hsl(120 100% 50%)",
      })
    })
  })

  describe("background color with brightness and opacity", () => {
    it("should apply brightness adjustment to background color", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          brightness: {
            type: ValueType.EXACT,
            value: { value: 20, unit: Unit.PERCENT },
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "hsl(0 0% 32%)",
      })
    })

    it("should apply both brightness and opacity to background color", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          brightness: {
            type: ValueType.EXACT,
            value: { value: -20, unit: Unit.PERCENT },
          },
          opacity: {
            type: ValueType.EXACT,
            value: { value: 75, unit: Unit.PERCENT },
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "hsl(0 0% 12% / 75%)",
      })
    })
  })

  describe("edge cases and boundary conditions", () => {
    it("should handle zero opacity", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          opacity: {
            type: ValueType.EXACT,
            value: { value: 0, unit: Unit.PERCENT },
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "hsl(0 0% 15% / 0%)",
      })
    })

    it("should handle 100% opacity", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          opacity: {
            type: ValueType.EXACT,
            value: { value: 100, unit: Unit.PERCENT },
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "hsl(0 0% 15%)",
      })
    })

    it("should handle extreme brightness values", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          brightness: {
            type: ValueType.EXACT,
            value: { value: 100, unit: Unit.PERCENT },
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toEqual({
        backgroundColor: "hsl(0 0% 100%)",
      })
    })
  })

  describe("comprehensive validation", () => {
    it("should return valid CSS object structure", () => {
      const properties: Properties = {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.background",
          },
        },
      }

      const result = getBackgroundColorStyles({
        properties,
        parentContext: null,
        theme: testTheme,
      })

      expect(result).toBeDefined()
      expect(typeof result).toBe("object")
      expect(result.backgroundColor).toBeDefined()
      expect(typeof result.backgroundColor).toBe("string")
      expect(result.backgroundColor.length).toBeGreaterThan(0)
    })

    it("should handle all theme swatch colors", () => {
      const themeSwatches = [
        "@swatch.primary",
        "@swatch.background",
        "@swatch.black",
        "@swatch.white",
        "@swatch.custom1",
        "@swatch.custom2",
      ] as const

      for (const swatch of themeSwatches) {
        const properties: Properties = {
          background: {
            color: {
              type: ValueType.THEME_CATEGORICAL,
              value: swatch,
            },
          },
        }

        const result = getBackgroundColorStyles({
          properties,
          parentContext: null,
          theme: testTheme,
        })

        expect(result).toBeDefined()
        expect(result.backgroundColor).toBeDefined()
        expect(typeof result.backgroundColor).toBe("string")
        expect(result.backgroundColor.length).toBeGreaterThan(0)
      }
    })
  })
})
