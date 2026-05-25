import { describe, expect, it } from "bun:test"
import { ComputedFunction, ValueType } from "../constants"
import { mergeProperties } from "./merge-properties"

describe("mergeProperties computed values", () => {
  it("preserves basedOn when merging partial computed patches", () => {
    const base = {
      color: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.HIGH_CONTRAST_COLOR,
          input: {
            basedOn: "#parent.background.color",
          },
        },
      },
    }

    const patch = {
      color: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.HIGH_CONTRAST_COLOR,
          input: {},
        },
      },
    }

    const merged = mergeProperties(base as any, patch as any)

    expect(merged.color).toEqual({
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#parent.background.color",
        },
      },
    })
  })
})
