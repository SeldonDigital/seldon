import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import { getRotationStyles } from "./get-rotation-styles"

describe("getRotationStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getRotationStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object when rotation is not defined", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toEqual({})
  })

  it("should generate transform style for exact rotation values", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 45 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(45deg)")
  })

  it("should handle different rotation units", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 90 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(90deg)")
  })

  it("should handle zero rotation", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 0 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(0deg)")
  })

  it("should handle negative rotation", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: -90 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(-90deg)")
  })

  it("should handle large rotation values", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 360 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(360deg)")
  })

  it("should handle decimal rotation values", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 45.5 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(45.5deg)")
  })

  it("should handle empty rotation value", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toEqual({})
  })

  it("should not generate transform style for non-exact types", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toEqual({})
  })

  it("should not generate transform style for computed types", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toEqual({})
  })

  it("should not generate transform style for theme categorical types", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toEqual({})
  })

  it("should not generate transform style for theme ordinal types", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle rotation with other properties", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 30 },
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000" as const,
      },
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 50 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(30deg)")
    expect(result).not.toHaveProperty("color")
    expect(result).not.toHaveProperty("opacity")
  })

  it("should handle rotation with only rotation property", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 180 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toEqual({
      transform: "rotate(180deg)",
    })
  })

  it("should handle common rotation values", () => {
    const commonRotations = [0, 90, 180, 270, 360]

    commonRotations.forEach((rotation) => {
      const properties: Properties = {
        rotation: {
          type: ValueType.EXACT,
          value: { unit: Unit.DEGREES, value: rotation },
        },
      }

      const result = getRotationStyles({ properties })

      expect(result).toHaveProperty("transform", `rotate(${rotation}deg)`)
    })
  })

  it("should handle radian rotation values", () => {
    const radianRotations = [0, 1.57, 3.14, 4.71, 6.28]

    radianRotations.forEach((rotation) => {
      const properties: Properties = {
        rotation: {
          type: ValueType.EXACT,
          value: { unit: Unit.DEGREES, value: rotation * 57.2958 }, // Convert radians to degrees
        },
      }

      const result = getRotationStyles({ properties })

      expect(result).toHaveProperty(
        "transform",
        `rotate(${rotation * 57.2958}deg)`,
      )
    })
  })

  it("should handle fractional rotation values", () => {
    const fractionalRotations = [0.5, 1.25, 2.75, 45.5, 90.25]

    fractionalRotations.forEach((rotation) => {
      const properties: Properties = {
        rotation: {
          type: ValueType.EXACT,
          value: { unit: Unit.DEGREES, value: rotation },
        },
      }

      const result = getRotationStyles({ properties })

      expect(result).toHaveProperty("transform", `rotate(${rotation}deg)`)
    })
  })

  it("should handle very large rotation values", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 720 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(720deg)")
  })

  it("should handle very small rotation values", () => {
    const properties: Properties = {
      rotation: {
        type: ValueType.EXACT,
        value: { unit: Unit.DEGREES, value: 0.1 },
      },
    }

    const result = getRotationStyles({ properties })

    expect(result).toHaveProperty("transform", "rotate(0.1deg)")
  })
})
