import { describe, expect, it } from "vitest"

import { Properties, ValueType } from "@seldon/core"

import { getClipStyles } from "./get-clip-styles"

const clip = (value: unknown): Properties =>
  ({ clip: { type: ValueType.EXACT, value } }) as unknown as Properties

describe("getClipStyles", () => {
  it("hides overflow when clip is boolean true", () => {
    expect(getClipStyles({ properties: clip(true) })).toEqual({
      overflow: "hidden",
    })
  })

  it("hides overflow when clip is numeric 1", () => {
    expect(getClipStyles({ properties: clip(1) })).toEqual({
      overflow: "hidden",
    })
  })

  it("hides overflow for the string 'true' or 'on'", () => {
    expect(getClipStyles({ properties: clip("TRUE") })).toEqual({
      overflow: "hidden",
    })
    expect(getClipStyles({ properties: clip("on") })).toEqual({
      overflow: "hidden",
    })
  })

  it("returns no styles for falsey or unrelated values", () => {
    expect(getClipStyles({ properties: clip(false) })).toEqual({})
    expect(getClipStyles({ properties: clip("off") })).toEqual({})
    expect(getClipStyles({ properties: clip(0) })).toEqual({})
  })

  it("returns no styles when clip is unset", () => {
    expect(getClipStyles({ properties: {} as unknown as Properties })).toEqual(
      {},
    )
  })
})
