import { describe, expect, it } from "vitest"

import { round } from "../../helpers/math"
import { STOCK_THEMES_BY_ID } from "../../themes/catalog"
import { computeTheme } from "../../themes/helpers/compute-theme"
import { ComputedFunction, ValueType } from "../constants"
import { computeProperties } from "./compute-properties"
import type { ComputeContext } from "./types"

const computed = computeTheme(STOCK_THEMES_BY_ID.seldon)
const factor = computed.autoFit.parameters.factor
const rhythm = computed.opticalPadding.parameters

const ctx = (
  properties: Record<string, unknown>,
  parentContext: ComputeContext | null = null,
): ComputeContext =>
  ({ properties, parentContext, theme: computed }) as unknown as ComputeContext

const props = (value: Record<string, unknown>) =>
  value as unknown as Parameters<typeof computeProperties>[0]

describe("computeProperties", () => {
  it("copies non-computed values through unchanged", () => {
    const input = props({ opacity: { type: ValueType.EXACT, value: 1 } })
    expect(computeProperties(input, ctx({}))).toEqual({
      opacity: { type: ValueType.EXACT, value: 1 },
    })
  })

  it("resolves a top-level AUTO_FIT computed value via the engine", () => {
    const parent = ctx({ buttonSize: { type: ValueType.EXACT, value: 10 } })
    const input = props({
      gap: { type: ValueType.COMPUTED, value: ComputedFunction.AUTO_FIT },
    })

    expect(computeProperties(input, ctx({}, parent)).gap).toEqual({
      type: ValueType.EXACT,
      value: round(10 * factor),
    })
  })

  it("resolves a computed facet under an object facet map", () => {
    const context = ctx({ buttonSize: { type: ValueType.EXACT, value: 8 } })
    const input = props({
      padding: {
        left: {
          type: ValueType.COMPUTED,
          value: ComputedFunction.OPTICAL_PADDING,
        },
      },
    })

    const result = computeProperties(input, context) as {
      padding: { left: unknown }
    }
    expect(result.padding.left).toEqual({
      type: ValueType.EXACT,
      value: round(8 * rhythm.leftRhythm),
    })
  })

  it("throws on an unknown computed function", () => {
    const input = props({
      gap: { type: ValueType.COMPUTED, value: "not-a-function" },
    })
    expect(() => computeProperties(input, ctx({}))).toThrow()
  })

  it("does not mutate the input properties", () => {
    const input = props({ opacity: { type: ValueType.EXACT, value: 1 } })
    const snapshot = JSON.stringify(input)
    computeProperties(input, ctx({}))
    expect(JSON.stringify(input)).toBe(snapshot)
  })
})
