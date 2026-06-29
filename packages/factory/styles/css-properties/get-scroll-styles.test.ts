import { Properties, ValueType } from "@seldon/core"
import { describe, expect, it } from "vitest"

import { getScrollStyles } from "./get-scroll-styles"

const scroll = (value: string): Properties =>
  ({ scroll: { type: ValueType.OPTION, value } }) as unknown as Properties

describe("getScrollStyles", () => {
  it("maps none to hidden overflow", () => {
    expect(getScrollStyles({ properties: scroll("none") })).toEqual({
      overflow: "hidden",
    })
  })

  it("maps horizontal to overflow-x auto", () => {
    expect(getScrollStyles({ properties: scroll("horizontal") })).toEqual({
      overflowX: "auto",
      overflowY: "hidden",
    })
  })

  it("maps vertical to overflow-y auto", () => {
    expect(getScrollStyles({ properties: scroll("vertical") })).toEqual({
      overflowX: "hidden",
      overflowY: "auto",
    })
  })

  it("maps both to overflow auto", () => {
    expect(getScrollStyles({ properties: scroll("both") })).toEqual({
      overflow: "auto",
    })
  })

  it("falls back to overflow auto for any other option", () => {
    expect(getScrollStyles({ properties: scroll("weird") })).toEqual({
      overflow: "auto",
    })
  })

  it("returns no styles when scroll is unset", () => {
    expect(
      getScrollStyles({ properties: {} as unknown as Properties }),
    ).toEqual({})
  })
})
