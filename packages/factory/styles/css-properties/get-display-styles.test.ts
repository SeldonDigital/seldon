import { describe, expect, it } from "vitest"

import { Display, ValueType } from "@seldon/core"

import { getDisplayStyles } from "./get-display-styles"

import type { Properties } from "@seldon/core"

const display = (value: Display): Properties =>
  ({ display: { type: ValueType.OPTION, value } }) as unknown as Properties

describe("getDisplayStyles", () => {
  it("maps EXCLUDE to display none", () => {
    expect(getDisplayStyles({ properties: display(Display.EXCLUDE) })).toEqual({
      display: "none",
    })
  })

  it("emits no styles for HIDE, which exports as an opt-in slot", () => {
    expect(getDisplayStyles({ properties: display(Display.HIDE) })).toEqual({})
  })

  it("returns no styles for SHOW", () => {
    expect(getDisplayStyles({ properties: display(Display.SHOW) })).toEqual({})
  })

  it("returns no styles when display is unset", () => {
    expect(getDisplayStyles({ properties: {} as unknown as Properties })).toEqual({})
  })
})
