import { describe, expect, it } from "vitest"

import { round } from "../../helpers/math"
import { STOCK_THEMES_BY_ID } from "../../themes/catalog"
import { computeTheme } from "../../themes/helpers/compute-theme"
import { ComputedFunction, EMPTY_VALUE, ValueType } from "../constants"
import { computeOpticalPadding } from "./compute-optical-padding"
import type { ComputeContext, ComputeKeys } from "./types"

const computed = computeTheme(STOCK_THEMES_BY_ID.seldon)
const rhythm = computed.opticalPadding.parameters

const marker = {
  type: ValueType.COMPUTED,
  value: ComputedFunction.OPTICAL_PADDING,
} as never

const ctx = (properties: Record<string, unknown>): ComputeContext =>
  ({
    properties,
    parentContext: null,
    theme: computed,
  }) as unknown as ComputeContext

const keys = (subPropertyKey: string): ComputeKeys =>
  ({ propertyKey: "padding", subPropertyKey }) as unknown as ComputeKeys

describe("computeOpticalPadding", () => {
  it("multiplies the self size by the left rhythm", () => {
    const context = ctx({ buttonSize: { type: ValueType.EXACT, value: 8 } })

    expect(computeOpticalPadding(marker, context, keys("left"))).toEqual({
      type: ValueType.EXACT,
      value: round(8 * rhythm.leftRhythm),
    })
  })

  it("uses the right rhythm for the right side", () => {
    const context = ctx({ buttonSize: { type: ValueType.EXACT, value: 8 } })

    expect(computeOpticalPadding(marker, context, keys("right"))).toEqual({
      type: ValueType.EXACT,
      value: round(8 * rhythm.rightRhythm),
    })
  })

  it("degrades to EMPTY when no source can be resolved", () => {
    expect(computeOpticalPadding(marker, ctx({}), keys("left"))).toEqual(
      EMPTY_VALUE,
    )
  })
})
