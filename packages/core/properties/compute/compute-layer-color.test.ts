import { describe, expect, it } from "vitest"

import { ValueType } from "../constants"
import {
  applyLayerOpacity,
  exactColorToChromaInput,
  normalizeLayerFacetPath,
} from "./compute-layer-color"

describe("normalizeLayerFacetPath", () => {
  it("anchors a bare paint facet path to layer 0", () => {
    expect(normalizeLayerFacetPath("background.color")).toBe("background.0.color")
    expect(normalizeLayerFacetPath("shadow.blur")).toBe("shadow.0.blur")
  })

  it("leaves indexed and non-paint paths unchanged", () => {
    expect(normalizeLayerFacetPath("background.1.color")).toBe(
      "background.1.color",
    )
    expect(normalizeLayerFacetPath("border.color")).toBe("border.color")
  })
})

describe("applyLayerOpacity", () => {
  it("returns the color at full opacity and the backdrop at zero", () => {
    expect(applyLayerOpacity("#112233", 100, "#ffffff")).toEqual({
      type: ValueType.EXACT,
      value: "#112233",
    })
    expect(applyLayerOpacity("#112233", 0, "#ffffff")).toEqual({
      type: ValueType.EXACT,
      value: "#ffffff",
    })
  })

  it("composites a translucent color into an opaque hex", () => {
    const result = applyLayerOpacity("#000000", 50, "#ffffff")
    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toMatch(/^#[0-9a-f]{6}$/i)
  })
})

describe("exactColorToChromaInput", () => {
  it("passes hex through and adds a missing hash", () => {
    expect(exactColorToChromaInput("#fff")).toBe("#fff")
    expect(exactColorToChromaInput("abcabc" as never)).toBe("#abcabc")
  })

  it("stringifies an rgb object", () => {
    expect(exactColorToChromaInput({ red: 255, green: 0, blue: 0 })).toBe(
      "rgb(255 0 0)",
    )
  })

  it("throws on an unparseable color", () => {
    expect(() => exactColorToChromaInput({ foo: 1 } as never)).toThrow()
  })
})
