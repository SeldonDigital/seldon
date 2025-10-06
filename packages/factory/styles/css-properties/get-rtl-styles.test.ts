import { describe, expect, it } from "bun:test"
import { Direction, Properties, ValueType } from "@seldon/core"
import { getRTLStyles } from "./get-rtl-styles"

describe("getRTLStyles", () => {
  it("should return empty object when direction is not in properties", () => {
    const properties: Properties = {}

    const result = getRTLStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return correct styles for right-to-left direction", () => {
    const properties: Properties = {
      direction: { type: ValueType.PRESET, value: Direction.RTL },
    }

    const result = getRTLStyles({ properties })

    expect(result).toEqual({ direction: "rtl" })
  })

  it("should return correct styles for left-to-right direction", () => {
    const properties: Properties = {
      direction: { type: ValueType.PRESET, value: Direction.LTR },
    }

    const result = getRTLStyles({ properties })

    expect(result).toEqual({ direction: "ltr" })
  })

  it("should return empty object when direction is empty", () => {
    const properties: Properties = {
      direction: { type: ValueType.EMPTY, value: null },
    }

    const result = getRTLStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle properties with other values alongside direction", () => {
    const properties: Properties = {
      direction: { type: ValueType.PRESET, value: Direction.RTL },
      color: { type: ValueType.EXACT, value: "#ff0000" },
    }

    const result = getRTLStyles({ properties })

    expect(result).toEqual({ direction: "rtl" })
    expect(result).not.toHaveProperty("color")
  })
})
