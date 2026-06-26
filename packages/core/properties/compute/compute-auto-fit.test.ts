import { describe, expect, it } from "vitest"

import { round } from "../../helpers/math"
import { STOCK_THEMES_BY_ID } from "../../themes/catalog"
import { computeTheme } from "../../themes/helpers/compute-theme"
import { ComputedFunction, ValueType } from "../constants"
import { computeAutoFit } from "./compute-auto-fit"
import type { ComputeContext } from "./types"

const computed = computeTheme(STOCK_THEMES_BY_ID.seldon)
const factor = computed.autoFit.parameters.factor

const marker = {
  type: ValueType.COMPUTED,
  value: ComputedFunction.AUTO_FIT,
} as never

const ctx = (
  properties: Record<string, unknown>,
  parentContext: ComputeContext | null = null,
): ComputeContext =>
  ({ properties, parentContext, theme: computed }) as unknown as ComputeContext

describe("computeAutoFit", () => {
  it("scales a numeric ancestor size by the theme factor", () => {
    const parent = ctx({ buttonSize: { type: ValueType.EXACT, value: 10 } })

    expect(computeAutoFit(marker, ctx({}, parent))).toEqual({
      type: ValueType.EXACT,
      value: round(10 * factor),
    })
  })

  it("scales an ancestor length while preserving its unit", () => {
    const parent = ctx({
      buttonSize: { type: ValueType.EXACT, value: { unit: "px", value: 16 } },
    })

    expect(computeAutoFit(marker, ctx({}, parent))).toEqual({
      type: ValueType.EXACT,
      value: { unit: "px", value: round(16 * factor) },
    })
  })

  it("falls back to a font-size rem length when no ancestor size exists", () => {
    const result = computeAutoFit(marker, ctx({})) as {
      type: ValueType
      value: { unit: string; value: number }
    }

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value.unit).toBe("rem")
    expect(typeof result.value.value).toBe("number")
  })
})
