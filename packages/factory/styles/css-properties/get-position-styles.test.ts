import { describe, expect, it } from "vitest"

import { Properties, Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getPositionStyles } from "./get-position-styles"

const px = (value: number) => ({
  type: ValueType.EXACT,
  value: { unit: Unit.PX, value },
})

describe("getPositionStyles", () => {
  it("serializes each offset and sets absolute positioning", () => {
    const properties = {
      position: { top: px(1), right: px(2), bottom: px(3), left: px(4) },
    } as unknown as Properties
    expect(getPositionStyles({ properties, theme: defaultTheme })).toEqual({
      top: "1px",
      right: "2px",
      bottom: "3px",
      left: "4px",
      position: "absolute",
    })
  })

  it("sets absolute positioning when only one offset is present", () => {
    const properties = { position: { top: px(10) } } as unknown as Properties
    expect(getPositionStyles({ properties, theme: defaultTheme })).toEqual({
      top: "10px",
      position: "absolute",
    })
  })

  it("returns no styles when position is unset", () => {
    expect(
      getPositionStyles({
        properties: {} as unknown as Properties,
        theme: defaultTheme,
      }),
    ).toEqual({})
  })
})
