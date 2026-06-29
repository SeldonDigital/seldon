import { describe, expect, it } from "vitest"

import { Properties, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { StyleGenerationContext } from "../types"
import { getColorStyles } from "./get-color-styles"

const context = (properties: Properties): StyleGenerationContext =>
  ({
    properties,
    parentContext: null,
    theme: defaultTheme,
  }) as StyleGenerationContext

const hex = (value: string) => ({ type: ValueType.EXACT, value })

describe("getColorStyles", () => {
  it("emits a resolved color", () => {
    expect(
      getColorStyles(
        context({ color: hex("#112233") } as unknown as Properties),
      ),
    ).toEqual({ color: "#112233" })
  })

  it("emits an accent color", () => {
    expect(
      getColorStyles(
        context({ accentColor: hex("#445566") } as unknown as Properties),
      ),
    ).toEqual({ accentColor: "#445566" })
  })

  it("does not emit color for symbol nodes", () => {
    expect(
      getColorStyles(
        context({
          symbol: hex("#112233"),
          color: hex("#112233"),
        } as unknown as Properties),
      ),
    ).toEqual({})
  })

  it("returns no styles when no color is set", () => {
    expect(getColorStyles(context({} as unknown as Properties))).toEqual({})
  })
})
