import { Direction, Properties, ValueType } from "@seldon/core"
import { describe, expect, it } from "vitest"

import { getRTLStyles } from "./get-rtl-styles"

const direction = (value: Direction): Properties =>
  ({ direction: { type: ValueType.OPTION, value } }) as unknown as Properties

describe("getRTLStyles", () => {
  it("maps RTL to direction rtl", () => {
    expect(getRTLStyles({ properties: direction(Direction.RTL) })).toEqual({
      direction: "rtl",
    })
  })

  it("maps LTR to direction ltr", () => {
    expect(getRTLStyles({ properties: direction(Direction.LTR) })).toEqual({
      direction: "ltr",
    })
  })

  it("returns no styles when direction is not an option value", () => {
    expect(
      getRTLStyles({
        properties: {
          direction: { type: ValueType.EMPTY, value: null },
        } as unknown as Properties,
      }),
    ).toEqual({})
  })

  it("returns no styles when direction is unset", () => {
    expect(getRTLStyles({ properties: {} as unknown as Properties })).toEqual(
      {},
    )
  })
})
