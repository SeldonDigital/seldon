import {
  Properties,
  TextAlign,
  TextDecoration,
  Unit,
  ValueType,
} from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"
import { describe, expect, it } from "vitest"

import { getTextStyles } from "./get-text-styles"
import { StyleGenerationContext } from "../types"

const context = (properties: Properties): StyleGenerationContext => ({
  properties,
  parentContext: null,
  theme: defaultTheme,
})

describe("getTextStyles", () => {
  it("maps an explicit text alignment", () => {
    const properties = {
      textAlign: { type: ValueType.OPTION, value: TextAlign.RIGHT },
    } as unknown as Properties
    expect(getTextStyles(context(properties))).toEqual({ textAlign: "right" })
  })

  it("maps auto alignment to start", () => {
    const properties = {
      textAlign: { type: ValueType.OPTION, value: TextAlign.AUTO },
    } as unknown as Properties
    expect(getTextStyles(context(properties))).toEqual({ textAlign: "start" })
  })

  it("maps underline and line-through decoration", () => {
    const underline = {
      textDecoration: {
        type: ValueType.OPTION,
        value: TextDecoration.UNDERLINE,
      },
    } as unknown as Properties
    expect(getTextStyles(context(underline))).toEqual({
      textDecoration: "underline",
    })

    const strike = {
      textDecoration: {
        type: ValueType.OPTION,
        value: TextDecoration.LINE_THROUGH,
      },
    } as unknown as Properties
    expect(getTextStyles(context(strike))).toEqual({
      textDecoration: "line-through",
    })
  })

  it("clamps non-wrapping text with ellipsis", () => {
    const properties = {
      wrapText: { type: ValueType.EXACT, value: false },
    } as unknown as Properties
    expect(getTextStyles(context(properties))).toEqual({
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    })
  })

  it("emits a resolved font size when font.size is in the schema", () => {
    const properties = {
      font: {
        size: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 16 } },
      },
    } as unknown as Properties
    expect(getTextStyles(context(properties))).toEqual({ fontSize: "16px" })
  })

  it("returns no styles for empty properties", () => {
    expect(getTextStyles(context({} as unknown as Properties))).toEqual({})
  })
})
