import { describe, expect, it } from "vitest"

import { Properties, Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getMarginStyles } from "./get-margin-styles"

const px = (value: number) => ({
  type: ValueType.EXACT,
  value: { unit: Unit.PX, value },
})

describe("getMarginStyles", () => {
  it("serializes each set side", () => {
    const properties = {
      margin: { top: px(4), right: px(8), bottom: px(12), left: px(16) },
    } as unknown as Properties
    expect(getMarginStyles({ properties, theme: defaultTheme })).toEqual({
      marginTop: "4px",
      marginRight: "8px",
      marginBottom: "12px",
      marginLeft: "16px",
    })
  })

  it("skips empty sides", () => {
    const properties = {
      margin: { top: px(4), bottom: { type: ValueType.EMPTY, value: null } },
    } as unknown as Properties
    expect(getMarginStyles({ properties, theme: defaultTheme })).toEqual({
      marginTop: "4px",
    })
  })

  it("returns no styles when margin is unset", () => {
    expect(
      getMarginStyles({
        properties: {} as unknown as Properties,
        theme: defaultTheme,
      }),
    ).toEqual({})
  })
})
