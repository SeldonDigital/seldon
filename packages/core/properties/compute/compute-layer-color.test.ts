import { describe, expect, it } from "vitest"

import { ValueType } from "../constants"
import { applyLayerOpacity } from "./compute-layer-color"
import { normalizeLayerFacetPath } from "./parse-based-on-path"

describe("normalizeLayerFacetPath", () => {
  it("anchors a bare paint facet path to layer 0", () => {
    expect(normalizeLayerFacetPath("background.color")).toBe(
      "background.0.color",
    )
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

  it("accepts object colors and hex without a hash", () => {
    const result = applyLayerOpacity(
      { red: 255, green: 0, blue: 0 },
      50,
      "abcabc" as never,
    )
    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it("throws on an unparseable color", () => {
    expect(() => applyLayerOpacity({ foo: 1 } as never, 50)).toThrow()
  })
})
