import { describe, expect, it } from "vitest"

import { Align, Properties, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getTableStyles } from "./get-table-styles"

const props = (p: Record<string, unknown>): Properties =>
  p as unknown as Properties

describe("getTableStyles", () => {
  it("maps a cell alignment to text and vertical align", () => {
    const properties = props({
      cellAlign: { type: ValueType.OPTION, value: Align.BOTTOM_RIGHT },
    })
    expect(getTableStyles({ properties, theme: defaultTheme })).toEqual({
      textAlign: "right",
      verticalAlign: "bottom",
    })
  })

  it("passes through inherit as vertical align inherit", () => {
    const properties = props({
      cellAlign: { type: ValueType.INHERIT, value: null },
    })
    expect(getTableStyles({ properties, theme: defaultTheme })).toEqual({
      verticalAlign: "inherit",
    })
  })

  it("ignores AUTO cell alignment", () => {
    const properties = props({
      cellAlign: { type: ValueType.OPTION, value: Align.AUTO },
    })
    expect(getTableStyles({ properties, theme: defaultTheme })).toEqual({})
  })

  it("emits border collapse from an option value", () => {
    const properties = props({
      borderCollapse: { type: ValueType.OPTION, value: "collapse" },
    })
    expect(getTableStyles({ properties, theme: defaultTheme })).toEqual({
      borderCollapse: "collapse",
    })
  })

  it("returns no styles when nothing is set", () => {
    expect(
      getTableStyles({ properties: props({}), theme: defaultTheme }),
    ).toEqual({})
  })
})
