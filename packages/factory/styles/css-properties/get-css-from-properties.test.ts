import { Display, Properties, Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"
import { describe, expect, it } from "vitest"

import { getCssFromProperties } from "./get-css-from-properties"
import { StyleGenerationContext } from "../types"

const context = (properties: Properties): StyleGenerationContext => ({
  properties,
  parentContext: null,
  theme: defaultTheme,
})

const px = (value: number) => ({
  type: ValueType.EXACT,
  value: { unit: Unit.PX, value },
})

describe("getCssFromProperties", () => {
  it("emits an empty rule for empty properties", () => {
    const props = {} as unknown as Properties
    expect(getCssFromProperties(props, context(props), "cls")).toBe(".cls {}")
  })

  it("renders display none for an excluded node", () => {
    const props = {
      display: { type: ValueType.OPTION, value: Display.EXCLUDE },
    } as unknown as Properties
    expect(getCssFromProperties(props, context(props), "cls")).toBe(
      ".cls {display: none;}",
    )
  })

  it("collapses equal padding sides into a shorthand", () => {
    const props = {
      padding: { top: px(4), right: px(4), bottom: px(4), left: px(4) },
    } as unknown as Properties
    const css = getCssFromProperties(props, context(props), "cls")
    expect(css).toContain("padding: 4px;")
    expect(css).not.toContain("padding-top")
  })

  it("scopes the output to the provided class name", () => {
    const props = {
      display: { type: ValueType.OPTION, value: Display.HIDE },
    } as unknown as Properties
    expect(getCssFromProperties(props, context(props), "my-node")).toBe(
      ".my-node {visibility: hidden;}",
    )
  })
})
