import { describe, expect, it } from "vitest"

import { HtmlElement } from "@seldon/core/properties"

import { getNativeFileStemsForUsedElements } from "./native-html-file-stem"

describe("getNativeFileStemsForUsedElements", () => {
  it("maps known elements to their file stems", () => {
    const stems = getNativeFileStemsForUsedElements(
      new Set([HtmlElement.DIV, HtmlElement.P, HtmlElement.A]),
    )
    expect(stems).toEqual(
      new Set(["HTML.Div", "HTML.Paragraph", "HTML.Anchor"]),
    )
  })

  it("deduplicates repeated stems", () => {
    const stems = getNativeFileStemsForUsedElements(
      new Set([HtmlElement.H1, HtmlElement.H1]),
    )
    expect(stems).toEqual(new Set(["HTML.Heading1"]))
  })

  it("skips elements that have no file stem", () => {
    const stems = getNativeFileStemsForUsedElements(
      new Set([HtmlElement.DIV, HtmlElement.MENU, HtmlElement.DL]),
    )
    expect(stems).toEqual(new Set(["HTML.Div"]))
  })

  it("returns an empty set for no elements", () => {
    expect(getNativeFileStemsForUsedElements(new Set())).toEqual(new Set())
  })
})
