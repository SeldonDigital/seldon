import { describe, expect, it } from "vitest"

import { Properties, Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getPaddingStyles } from "./get-padding-styles"

const px = (value: number) => ({
  type: ValueType.EXACT,
  value: { unit: Unit.PX, value },
})

describe("getPaddingStyles", () => {
  it("serializes each set side", () => {
    const properties = {
      padding: { top: px(1), right: px(2), bottom: px(3), left: px(4) },
    } as unknown as Properties
    expect(getPaddingStyles({ properties, theme: defaultTheme })).toEqual({
      paddingTop: "1px",
      paddingInlineEnd: "2px",
      paddingBottom: "3px",
      paddingInlineStart: "4px",
    })
  })

  it("skips empty sides", () => {
    const properties = {
      padding: { left: px(4), right: { type: ValueType.EMPTY, value: null } },
    } as unknown as Properties
    expect(getPaddingStyles({ properties, theme: defaultTheme })).toEqual({
      paddingInlineStart: "4px",
    })
  })

  it("returns no styles when padding is unset", () => {
    expect(
      getPaddingStyles({
        properties: {} as unknown as Properties,
        theme: defaultTheme,
      }),
    ).toEqual({})
  })
})
