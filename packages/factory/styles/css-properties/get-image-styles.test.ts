import { describe, expect, it } from "bun:test"
import { Properties, ValueType } from "@seldon/core"
import { ImageFit } from "@seldon/core/properties/constants"
import { getImageStyles } from "./get-image-styles"

describe("getImageStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getImageStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object when source is not defined", () => {
    const properties: Properties = {
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.COVER,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({})
  })

  it("should generate objectFit cover for source without imageFit", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
  })

  it("should generate objectFit cover for source with imageFit cover", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.COVER,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
  })

  it("should generate objectFit contain for source with imageFit contain", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.CONTAIN,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "contain",
    })
  })

  it("should generate objectFit fill for source with imageFit stretch", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.STRETCH,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "fill",
    })
  })

  it("should generate objectFit none for source with imageFit original", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.ORIGINAL,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "none",
    })
  })

  it("should generate objectFit contain for source with imageFit contain", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.CONTAIN,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "contain",
    })
  })

  it("should generate objectFit cover for source with unknown imageFit", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.PRESET,
        // @ts-expect-error - Testing invalid preset value
        value: "unknown",
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
  })

  it("should handle empty source value", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EMPTY,
        value: null,
      },
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.COVER,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle empty imageFit value", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
  })

  it("should handle image styles with other properties", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.COVER,
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
    expect(result).not.toHaveProperty("color")
  })

  it("should handle image styles with only image properties", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "image.jpg",
      },
      imageFit: {
        type: ValueType.PRESET,
        value: ImageFit.CONTAIN,
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "contain",
    })
  })

  it("should handle all imageFit values", () => {
    const imageFitValues = [
      ImageFit.COVER,
      ImageFit.CONTAIN,
      ImageFit.STRETCH,
      ImageFit.ORIGINAL,
    ]

    imageFitValues.forEach((imageFit) => {
      const properties: Properties = {
        source: {
          type: ValueType.EXACT,
          value: "image.jpg",
        },
        imageFit: {
          type: ValueType.PRESET,
          value: imageFit,
        },
      }

      const result = getImageStyles({ properties })

      const expectedObjectFit =
        imageFit === ImageFit.STRETCH
          ? "fill"
          : imageFit === ImageFit.ORIGINAL
            ? "none"
            : imageFit
      expect(result).toEqual({
        objectFit: expectedObjectFit,
      })
    })
  })

  it("should handle source with different image formats", () => {
    const imageSources = [
      "image.jpg",
      "image.png",
      "image.gif",
      "image.svg",
      "image.webp",
      "image.avif",
    ]

    imageSources.forEach((source) => {
      const properties: Properties = {
        source: {
          type: ValueType.EXACT,
          value: source,
        },
      }

      const result = getImageStyles({ properties })

      expect(result).toEqual({
        objectFit: "cover",
      })
    })
  })

  it("should handle source with URL paths", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "https://example.com/image.jpg",
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
  })

  it("should handle source with relative paths", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "./assets/image.jpg",
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
  })

  it("should handle source with absolute paths", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value: "/public/images/image.jpg",
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
  })

  it("should handle source with data URLs", () => {
    const properties: Properties = {
      source: {
        type: ValueType.EXACT,
        value:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PC9zdmc+",
      },
    }

    const result = getImageStyles({ properties })

    expect(result).toEqual({
      objectFit: "cover",
    })
  })
})
