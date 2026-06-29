import { ComponentId } from "@seldon/core/components/constants"
import { HtmlElement } from "@seldon/core/properties"
import { describe, expect, it } from "vitest"

import { HTML_ELEMENT_OPTIONS } from "./html-element-options"

describe("HTML_ELEMENT_OPTIONS", () => {
  it("maps List to ul and ol", () => {
    expect(HTML_ELEMENT_OPTIONS[ComponentId.LIST]).toEqual([
      HtmlElement.UL,
      HtmlElement.OL,
    ])
  })

  it("maps List Item to li, dt, and dd", () => {
    expect(HTML_ELEMENT_OPTIONS[ComponentId.LIST_ITEM]).toEqual([
      HtmlElement.LI,
      HtmlElement.DT,
      HtmlElement.DD,
    ])
  })

  it("includes the inline text elements for Text", () => {
    const text = HTML_ELEMENT_OPTIONS[ComponentId.TEXT]
    expect(text).toContain(HtmlElement.P)
    expect(text).toContain(HtmlElement.SPAN)
    expect(text).toContain(HtmlElement.H1)
    expect(text).not.toContain(HtmlElement.DIV)
  })

  it("maps Option Group to optgroup", () => {
    expect(HTML_ELEMENT_OPTIONS[ComponentId.OPTION_GROUP]).toEqual([
      HtmlElement.OPTGROUP,
    ])
  })
})
