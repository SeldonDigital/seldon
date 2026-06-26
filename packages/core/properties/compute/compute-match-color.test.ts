import { describe, expect, it } from "vitest"

import { ComputedFunction, EMPTY_VALUE, ValueType } from "../constants"
import { computeMatchColor } from "./compute-match-color"
import type { ComputeContext } from "./types"

const marker = {
  type: ValueType.COMPUTED,
  value: ComputedFunction.MATCH_COLOR,
} as never

const ctx = (
  properties: Record<string, unknown>,
  parentContext: ComputeContext | null = null,
): ComputeContext =>
  ({ properties, parentContext, theme: undefined }) as unknown as ComputeContext

describe("computeMatchColor", () => {
  it("returns the contributing color from an ancestor background", () => {
    const primary = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    }
    const parent = ctx({ background: [{ color: primary }] })

    expect(computeMatchColor(marker, ctx({}, parent))).toEqual(primary)
  })

  it("degrades to EMPTY when no source can be resolved", () => {
    expect(computeMatchColor(marker, ctx({}))).toEqual(EMPTY_VALUE)
  })

  it("degrades to EMPTY when the matched value is still computed", () => {
    const self = ctx({
      background: [
        {
          color: {
            type: ValueType.COMPUTED,
            value: ComputedFunction.MATCH_COLOR,
          },
        },
      ],
    })

    expect(computeMatchColor(marker, self)).toEqual(EMPTY_VALUE)
  })
})
