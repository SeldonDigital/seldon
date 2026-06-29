import { describe, expect, it } from "vitest"

import { Display, Properties, ValueType } from "@seldon/core"

import { getDisplayStyles } from "./get-display-styles"

const display = (value: Display): Properties =>
  ({ display: { type: ValueType.OPTION, value } }) as unknown as Properties

describe("getDisplayStyles", () => {
  it("maps EXCLUDE to display none", () => {
    expect(getDisplayStyles({ properties: display(Display.EXCLUDE) })).toEqual({
      display: "none",
    })
  })

  it("maps HIDE to visibility hidden", () => {
    expect(getDisplayStyles({ properties: display(Display.HIDE) })).toEqual({
      visibility: "hidden",
    })
  })

  it("returns no styles for SHOW", () => {
    expect(getDisplayStyles({ properties: display(Display.SHOW) })).toEqual({})
  })

  it("returns no styles when display is unset", () => {
    expect(
      getDisplayStyles({ properties: {} as unknown as Properties }),
    ).toEqual({})
  })
})
