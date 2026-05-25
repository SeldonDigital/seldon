import { describe, expect, it } from "bun:test"
import {
  childPathsUnderCompoundParent,
  layeredFacetPath,
  parsePropertyPath,
} from "./property-paths"

describe("property-paths", () => {
  it("parses layered facet paths", () => {
    expect(parsePropertyPath("background.0.color")).toEqual({
      kind: "layered-facet",
      root: "background",
      facet: "color",
    })
  })

  it("parses facet compound paths", () => {
    expect(parsePropertyPath("border.color")).toEqual({
      kind: "facet",
      root: "border",
      facet: "color",
    })
  })

  it("builds layered facet paths", () => {
    expect(layeredFacetPath("background", "preset")).toBe("background.0.preset")
  })

  it("matches children under layered compound parent", () => {
    expect(
      childPathsUnderCompoundParent("background", "background.0.color"),
    ).toBe(true)
    expect(childPathsUnderCompoundParent("background", "background.color")).toBe(
      false,
    )
  })
})
