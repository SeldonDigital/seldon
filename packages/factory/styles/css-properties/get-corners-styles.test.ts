import { describe, expect, it } from "vitest"

import { Corner, Properties, Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getCornersStyles } from "./get-corners-styles"

const px = (value: number) => ({
  type: ValueType.EXACT,
  value: { unit: Unit.PX, value },
})

describe("getCornersStyles", () => {
  it("serializes each corner radius", () => {
    const properties = {
      corners: {
        topLeft: px(1),
        topRight: px(2),
        bottomLeft: px(3),
        bottomRight: px(4),
      },
    } as unknown as Properties
    expect(getCornersStyles({ properties, theme: defaultTheme })).toEqual({
      borderTopLeftRadius: "1px",
      borderTopRightRadius: "2px",
      borderBottomLeftRadius: "3px",
      borderBottomRightRadius: "4px",
    })
  })

  it("serializes a rounded option corner", () => {
    const properties = {
      corners: { topLeft: { type: ValueType.OPTION, value: Corner.ROUNDED } },
    } as unknown as Properties
    expect(getCornersStyles({ properties, theme: defaultTheme })).toEqual({
      borderTopLeftRadius: "99999px",
    })
  })

  it("returns no styles when corners is unset", () => {
    expect(
      getCornersStyles({
        properties: {} as unknown as Properties,
        theme: defaultTheme,
      }),
    ).toEqual({})
  })
})
