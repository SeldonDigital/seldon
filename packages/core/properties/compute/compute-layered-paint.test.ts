import { describe, expect, it } from "vitest"

import { ComputedFunction, ValueType } from "../constants"
import { computeLayeredPaintStack } from "./compute-layered-paint"
import type { ComputeContext } from "./types"

const context = {
  properties: {},
  parentContext: null,
  theme: {
    matchColor: { parameters: { includeBrightness: false, includeOpacity: false } },
  },
} as unknown as ComputeContext

describe("computeLayeredPaintStack", () => {
  it("copies plain facets and resolves computed facets per layer", () => {
    const dispatch = (value: { value: unknown }, _c: unknown, keys: { subPropertyKey?: string }) =>
      ({ resolved: keys.subPropertyKey, fn: value.value }) as never

    const layers = [
      { color: { type: ValueType.EXACT, value: "#fff" } },
      { color: { type: ValueType.COMPUTED, value: ComputedFunction.MATCH_COLOR } },
    ]

    const result = computeLayeredPaintStack(
      "background",
      layers,
      context,
      dispatch as never,
    )

    expect(result[0]).toEqual({ color: { type: ValueType.EXACT, value: "#fff" } })
    expect(result[1]).toEqual({
      color: { resolved: "color", fn: ComputedFunction.MATCH_COLOR },
    })
  })

  it("passes non-object layers through untouched", () => {
    const result = computeLayeredPaintStack(
      "shadow",
      [null, "x"],
      context,
      (() => ({})) as never,
    )
    expect(result).toEqual([null, "x"])
  })
})
