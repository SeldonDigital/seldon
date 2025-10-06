import { describe, expect, it } from "bun:test"
import {
  BackgroundPosition,
  BackgroundRepeat,
  ImageFit,
  Properties,
  Unit,
  ValueType,
} from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getBackgroundImageStyles } from "./get-background-image-styles"

describe("getBackgroundImageStyles", () => {
  describe("when no background properties are defined", () => {
    it("should return empty object when properties are empty", () => {
      const properties = {}

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({})
    })

    it("should return empty object when background property is not defined", () => {
      const properties: Properties = {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({})
    })

    it("should return empty object when background preset has no image", () => {
      const properties: Properties = {
        background: {
          preset: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@background.primary",
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({})
    })
  })

  describe("when background image is defined", () => {
    it("should return correct styles for exact image URL", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
      })
    })

    it("should return correct styles for theme background preset with image", () => {
      const properties: Properties = {
        background: {
          preset: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@background.background1",
          },
          image: { type: ValueType.EMPTY, value: null },
          repeat: { type: ValueType.EMPTY, value: null },
          size: { type: ValueType.PRESET, value: ImageFit.CONTAIN },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage:
          "url(https://img.freepik.com/premium-photo/white-abstract-background-with-subtle-d-texture_947794-79438.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      })
    })

    it("should return correct styles for theme background preset with repeated image", () => {
      const properties: Properties = {
        background: {
          preset: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@background.background2",
          },
          image: { type: ValueType.EMPTY, value: null },
          repeat: { type: ValueType.EMPTY, value: null },
          size: { type: ValueType.PRESET, value: ImageFit.ORIGINAL },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage:
          "url(https://img.freepik.com/premium-photo/white-abstract-background-with-subtle-d-texture_947794-79438.jpg)",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      })
    })
  })

  describe("background repeat property", () => {
    it("should return correct repeat style for no-repeat", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          repeat: { type: ValueType.PRESET, value: BackgroundRepeat.NO_REPEAT },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundRepeat: "no-repeat",
      })
    })

    it("should return correct repeat style for repeat", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          repeat: { type: ValueType.PRESET, value: BackgroundRepeat.REPEAT },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundRepeat: "repeat",
      })
    })

    it("should return correct repeat style for repeat", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          repeat: { type: ValueType.PRESET, value: BackgroundRepeat.REPEAT },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundRepeat: "repeat",
      })
    })
  })

  describe("background size property", () => {
    it("should return correct size for exact pixel values", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          size: {
            type: ValueType.EXACT,
            value: {
              x: { value: 100, unit: Unit.PX },
              y: { value: 200, unit: Unit.PX },
            },
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundSize: "100px 200px",
      })
    })

    it("should return correct size for exact percentage values", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          size: {
            type: ValueType.EXACT,
            value: {
              x: { value: 50, unit: Unit.PERCENT },
              y: { value: 75, unit: Unit.PERCENT },
            },
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundSize: "50% 75%",
      })
    })

    it("should return correct size for preset ImageFit values", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          size: { type: ValueType.PRESET, value: ImageFit.COVER },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundSize: "cover",
      })
    })

    it("should return correct size for contain preset", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          size: { type: ValueType.PRESET, value: ImageFit.CONTAIN },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundSize: "contain",
      })
    })

    it("should return correct size for stretch preset", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          size: { type: ValueType.PRESET, value: ImageFit.STRETCH },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundSize: "100% 100%",
      })
    })
  })

  describe("background position property", () => {
    it("should return correct position for exact pixel values", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          position: {
            type: ValueType.EXACT,
            value: {
              x: { value: 10, unit: Unit.PX },
              y: { value: 20, unit: Unit.PX },
            },
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundPosition: "10px 20px",
      })
    })

    it("should return correct position for exact percentage values", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          position: {
            type: ValueType.EXACT,
            value: {
              x: { value: 25, unit: Unit.PERCENT },
              y: { value: 50, unit: Unit.PERCENT },
            },
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundPosition: "25% 50%",
      })
    })

    it("should return correct position for preset values", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          position: {
            type: ValueType.PRESET,
            value: BackgroundPosition.CENTER,
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundPosition: "center",
      })
    })

    it("should return correct position for top-left preset", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          position: {
            type: ValueType.PRESET,
            value: BackgroundPosition.TOP_LEFT,
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundPosition: "top left",
      })
    })
  })

  describe("combined background properties", () => {
    it("should return all properties when multiple are defined", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          repeat: { type: ValueType.PRESET, value: BackgroundRepeat.NO_REPEAT },
          size: { type: ValueType.PRESET, value: ImageFit.COVER },
          position: {
            type: ValueType.PRESET,
            value: BackgroundPosition.CENTER,
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      })
    })

    it("should handle mixed exact and preset values", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          repeat: { type: ValueType.PRESET, value: BackgroundRepeat.REPEAT },
          size: {
            type: ValueType.EXACT,
            value: {
              x: { value: 300, unit: Unit.PX },
              y: { value: 200, unit: Unit.PX },
            },
          },
          position: {
            type: ValueType.EXACT,
            value: {
              x: { value: 0, unit: Unit.PX },
              y: { value: 0, unit: Unit.PX },
            },
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundRepeat: "repeat",
        backgroundSize: "300px 200px",
        backgroundPosition: "0px 0px",
      })
    })
  })

  describe("edge cases and boundary conditions", () => {
    it("should handle zero values for size", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          size: {
            type: ValueType.EXACT,
            value: {
              x: { value: 0, unit: Unit.PX },
              y: { value: 0, unit: Unit.PX },
            },
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundSize: "0px 0px",
      })
    })

    it("should handle zero values for position", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          position: {
            type: ValueType.EXACT,
            value: {
              x: { value: 0, unit: Unit.PX },
              y: { value: 0, unit: Unit.PX },
            },
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundPosition: "0px 0px",
      })
    })

    it("should handle large values", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          size: {
            type: ValueType.EXACT,
            value: {
              x: { value: 9999, unit: Unit.PX },
              y: { value: 9999, unit: Unit.PX },
            },
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toEqual({
        backgroundImage: "url(https://example.com/image.jpg)",
        backgroundSize: "9999px 9999px",
      })
    })
  })

  describe("comprehensive validation", () => {
    it("should return valid CSS object structure", () => {
      const properties: Properties = {
        background: {
          image: {
            type: ValueType.EXACT,
            value: "https://example.com/image.jpg",
          },
          repeat: { type: ValueType.PRESET, value: BackgroundRepeat.NO_REPEAT },
          size: { type: ValueType.PRESET, value: ImageFit.COVER },
          position: {
            type: ValueType.PRESET,
            value: BackgroundPosition.CENTER,
          },
        },
      }

      const result = getBackgroundImageStyles({ properties, theme: testTheme })

      expect(result).toBeDefined()
      expect(typeof result).toBe("object")
      expect(result.backgroundImage).toBeDefined()
      expect(typeof result.backgroundImage).toBe("string")
      expect(result.backgroundImage.startsWith("url(")).toBe(true)
      expect(result.backgroundImage.endsWith(")")).toBe(true)
    })

    it("should handle all BackgroundRepeat enum values", () => {
      const repeatValues = [BackgroundRepeat.NO_REPEAT, BackgroundRepeat.REPEAT]

      for (const repeat of repeatValues) {
        const properties: Properties = {
          background: {
            image: {
              type: ValueType.EXACT,
              value: "https://example.com/image.jpg",
            },
            repeat: { type: ValueType.PRESET, value: repeat },
          },
        }

        const result = getBackgroundImageStyles({
          properties,
          theme: testTheme,
        })

        expect(result).toBeDefined()
        expect(result.backgroundRepeat).toBeDefined()
        expect(typeof result.backgroundRepeat).toBe("string")
        expect(result.backgroundRepeat.length).toBeGreaterThan(0)
      }
    })

    it("should handle all ImageFit enum values", () => {
      const imageFitValues = [
        ImageFit.ORIGINAL,
        ImageFit.CONTAIN,
        ImageFit.COVER,
        ImageFit.STRETCH,
      ]

      for (const imageFit of imageFitValues) {
        const properties: Properties = {
          background: {
            image: {
              type: ValueType.EXACT,
              value: "https://example.com/image.jpg",
            },
            size: { type: ValueType.PRESET, value: imageFit },
          },
        }

        const result = getBackgroundImageStyles({
          properties,
          theme: testTheme,
        })

        expect(result).toBeDefined()
        expect(result.backgroundSize).toBeDefined()
        expect(typeof result.backgroundSize).toBe("string")
        expect((result.backgroundSize as string).length).toBeGreaterThan(0)
      }
    })

    it("should handle all BackgroundPosition enum values", () => {
      const positionValues = [
        BackgroundPosition.DEFAULT,
        BackgroundPosition.TOP_LEFT,
        BackgroundPosition.TOP_CENTER,
        BackgroundPosition.TOP_RIGHT,
        BackgroundPosition.CENTER_LEFT,
        BackgroundPosition.CENTER,
        BackgroundPosition.CENTER_RIGHT,
        BackgroundPosition.BOTTOM_LEFT,
        BackgroundPosition.BOTTOM_CENTER,
        BackgroundPosition.BOTTOM_RIGHT,
      ]

      for (const position of positionValues) {
        const properties: Properties = {
          background: {
            image: {
              type: ValueType.EXACT,
              value: "https://example.com/image.jpg",
            },
            position: { type: ValueType.PRESET, value: position },
          },
        }

        const result = getBackgroundImageStyles({
          properties,
          theme: testTheme,
        })

        expect(result).toBeDefined()
        expect(result.backgroundPosition).toBeDefined()
        expect(typeof result.backgroundPosition).toBe("string")
        expect((result.backgroundPosition as string).length).toBeGreaterThan(0)
      }
    })
  })
})
