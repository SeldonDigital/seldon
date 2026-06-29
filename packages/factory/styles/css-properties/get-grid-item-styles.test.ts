import { describe, expect, it } from "vitest"

import { Properties, Unit, ValueType } from "@seldon/core"

import { getGridItemStyles } from "./get-grid-item-styles"

const num = (value: number) => ({
  type: ValueType.EXACT,
  value: { unit: Unit.NUMBER, value },
})

describe("getGridItemStyles", () => {
  it("builds grid-column from start and span", () => {
    const properties = {
      columnStart: num(2),
      columnSpan: num(3),
    } as unknown as Properties
    expect(getGridItemStyles({ properties })).toEqual({
      gridColumn: "2 / span 3",
    })
  })

  it("uses only the start when span is absent", () => {
    const properties = { rowStart: num(4) } as unknown as Properties
    expect(getGridItemStyles({ properties })).toEqual({ gridRow: "4" })
  })

  it("uses only the span when start is absent", () => {
    const properties = { columnSpan: num(2) } as unknown as Properties
    expect(getGridItemStyles({ properties })).toEqual({
      gridColumn: "span 2",
    })
  })

  it("accepts plain number exact values", () => {
    const properties = {
      columnStart: { type: ValueType.EXACT, value: 1 },
    } as unknown as Properties
    expect(getGridItemStyles({ properties })).toEqual({ gridColumn: "1" })
  })

  it("ignores values below 1", () => {
    const properties = { columnSpan: num(0) } as unknown as Properties
    expect(getGridItemStyles({ properties })).toEqual({})
  })

  it("floors fractional counts", () => {
    const properties = { columnSpan: num(2.9) } as unknown as Properties
    expect(getGridItemStyles({ properties })).toEqual({
      gridColumn: "span 2",
    })
  })

  it("returns no styles when nothing is set", () => {
    expect(
      getGridItemStyles({ properties: {} as unknown as Properties }),
    ).toEqual({})
  })
})
