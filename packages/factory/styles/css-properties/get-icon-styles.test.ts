import { describe, expect, it } from "vitest"

import { Properties, Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { StyleGenerationContext } from "../types"
import { getIconStyles } from "./get-icon-styles"

const context = (properties: Properties): StyleGenerationContext => ({
  properties,
  parentContext: null,
  theme: defaultTheme,
})

const symbol = { type: ValueType.EXACT, value: "star" }

describe("getIconStyles", () => {
  it("sets font size and color for a symbol with size and color", () => {
    const properties = {
      symbol,
      size: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 24 } },
      color: { type: ValueType.EXACT, value: "#00ff00" },
    } as unknown as Properties
    expect(getIconStyles(context(properties))).toEqual({
      fontSize: "24px",
      color: "#00ff00",
    })
  })

  it("does not set size or color without a symbol", () => {
    const properties = {
      size: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 24 } },
      color: { type: ValueType.EXACT, value: "#00ff00" },
    } as unknown as Properties
    expect(getIconStyles(context(properties))).toEqual({})
  })

  it("ignores an empty size", () => {
    const properties = {
      symbol,
      size: { type: ValueType.EMPTY, value: null },
    } as unknown as Properties
    expect(getIconStyles(context(properties))).toEqual({})
  })
})
