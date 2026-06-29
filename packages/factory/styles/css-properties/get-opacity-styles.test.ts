import { describe, expect, it } from "vitest"

import { Properties, Unit, ValueType } from "@seldon/core"

import { getOpacityStyles } from "./get-opacity-styles"

const opacity = (value: number): Properties =>
  ({
    opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value } },
  }) as unknown as Properties

describe("getOpacityStyles", () => {
  it("converts a sub-100 percentage to a 0-1 fraction", () => {
    expect(getOpacityStyles({ properties: opacity(50) })).toEqual({
      opacity: 0.5,
    })
  })

  it("omits opacity when the value is 100", () => {
    expect(getOpacityStyles({ properties: opacity(100) })).toEqual({})
  })

  it("rounds to four decimal places to avoid float drift", () => {
    expect(getOpacityStyles({ properties: opacity(99.9) })).toEqual({
      opacity: 0.999,
    })
  })

  it("returns no styles when opacity is unset", () => {
    expect(
      getOpacityStyles({ properties: {} as unknown as Properties }),
    ).toEqual({})
  })
})
