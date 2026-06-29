import { describe, expect, it } from "vitest"

import { Properties, ValueType } from "@seldon/core"

import { getListStyles } from "./get-list-styles"

describe("getListStyles", () => {
  it("emits list style type and position from option values", () => {
    const properties = {
      listStyleType: { type: ValueType.OPTION, value: "disc" },
      listStylePosition: { type: ValueType.OPTION, value: "inside" },
    } as unknown as Properties
    expect(getListStyles({ properties })).toEqual({
      listStyleType: "disc",
      listStylePosition: "inside",
    })
  })

  it("ignores non-option values", () => {
    const properties = {
      listStyleType: { type: ValueType.EMPTY, value: null },
    } as unknown as Properties
    expect(getListStyles({ properties })).toEqual({})
  })

  it("returns no styles when unset", () => {
    expect(getListStyles({ properties: {} as unknown as Properties })).toEqual(
      {},
    )
  })
})
