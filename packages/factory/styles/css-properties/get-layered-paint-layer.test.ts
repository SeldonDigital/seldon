import { Properties } from "@seldon/core"
import { describe, expect, it } from "vitest"

import { getLayeredPaintLayers } from "./get-layered-paint-layer"

describe("getLayeredPaintLayers", () => {
  it("returns an empty array when the stack is missing", () => {
    expect(
      getLayeredPaintLayers({} as unknown as Properties, "background"),
    ).toEqual([])
  })

  it("returns array stacks as-is", () => {
    const layers = [{ color: { value: "a" } }, { color: { value: "b" } }]
    expect(
      getLayeredPaintLayers(
        { shadow: layers } as unknown as Properties,
        "shadow",
      ),
    ).toEqual(layers)
  })

  it("filters out non-object entries from an array stack", () => {
    const layers = [{ color: {} }, null, undefined, [1]]
    expect(
      getLayeredPaintLayers(
        { background: layers } as unknown as Properties,
        "background",
      ),
    ).toEqual([{ color: {} }])
  })

  it("normalizes a single-object stack into a one-item list", () => {
    const single = { color: { value: "x" } }
    expect(
      getLayeredPaintLayers(
        { background: single } as unknown as Properties,
        "background",
      ),
    ).toEqual([single])
  })
})
