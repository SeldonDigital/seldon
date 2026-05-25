import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import { getOpacityStyles } from "./get-opacity-styles"

describe("getOpacityStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object when opacity is not defined", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({})
  })

  it("should generate opacity style for values less than 100", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 50 },
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({
      opacity: 0.5,
    })
  })

  it("should not generate opacity style for values equal to 100", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 100 },
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({})
  })

  it("should not generate opacity style for values greater than 100", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 150 },
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle zero opacity", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 0 },
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({
      opacity: 0,
    })
  })

  it("should handle various opacity values", () => {
    const opacityValues = [10, 25, 50, 75, 90, 99]

    opacityValues.forEach((opacityValue) => {
      const properties: Properties = {
        opacity: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: opacityValue },
        },
      }

      const result = getOpacityStyles({ properties })

      expect(result).toEqual({
        opacity: opacityValue / 100,
      })
    })
  })

  it("should handle decimal opacity values", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 33.33 },
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({
      opacity: 0.3333,
    })
  })

  it("should handle empty opacity value", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle opacity with other properties", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 75 },
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({
      opacity: 0.75,
    })
  })

  it("should handle opacity with only opacity property", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 60 },
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({
      opacity: 0.6,
    })
  })

  it("should handle edge case opacity values", () => {
    const edgeCases = [
      { input: 0.1, expected: 0.001 },
      { input: 1, expected: 0.01 },
      { input: 99.9, expected: 0.999 },
      { input: 100, expected: undefined },
      { input: 100.1, expected: undefined },
    ]

    edgeCases.forEach(({ input, expected }) => {
      const properties: Properties = {
        opacity: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: input },
        },
      }

      const result = getOpacityStyles({ properties })

      if (expected === undefined) {
        expect(result).toEqual({})
      } else {
        expect(result).toEqual({
          opacity: expected,
        })
      }
    })
  })

  it("should handle negative opacity values", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: -10 },
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({
      opacity: -0.1,
    })
  })

  it("should handle very large opacity values", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 1000 },
      },
    }

    const result = getOpacityStyles({ properties })

    expect(result).toEqual({})
  })
})
