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

  it("should set overflow hidden when clip value is string 'true'", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: "true" },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({
      overflow: "hidden",
    })
  })

  it("should set overflow hidden when clip value is string 'on'", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: "on" },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({
      overflow: "hidden",
    })
  })

  it("should set overflow hidden when clip value is string 'On'", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: "On" },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({
      overflow: "hidden",
    })
  })

  it("should set overflow hidden when clip value is number 1", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: 1 },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({
      overflow: "hidden",
    })
  })

  it("should return empty object when clip value is string 'false'", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: "false" },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object when clip value is string 'off'", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: "off" },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object when clip value is number 0", () => {
    const properties: Properties = {
      clip: { type: ValueType.EXACT, value: 0 },
    }

    const result = getClipStyles({ properties })

    expect(result).toEqual({})
  })
})
