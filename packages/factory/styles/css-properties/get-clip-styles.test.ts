import { describe, expect, it } from "bun:test"
import { Properties, ValueType } from "@seldon/core"
import { getClipStyles } from "./get-clip-styles"

describe("getClipStyles", () => {
  it("should return an empty object when no clip properties are set", () => {
    const properties: Properties = {}

    const result = getClipStyles({ properties })

    expect(result).toEqual({})
  })

  it("should set overflow hidden when clip is true", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: true },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({
      overflow: "hidden",
    })
  })

  it("should return empty object when clip is false", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: false },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object when clip is undefined", () => {
    const properties: Properties = {
      clip: { type: ValueType.EMPTY, value: null },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({})
  })
})
