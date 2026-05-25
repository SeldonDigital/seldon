import { describe, expect, it } from "bun:test"
import { ComputedFunction, ValueType } from "../constants"
import type { ComputedHighContrastValue } from "../values/shared/computed/high-contrast-color"
import { getBasedOnValue } from "./get-based-on-value"
import type { ComputeContext } from "./types"

describe("getBasedOnValue", () => {
  it("resolves layered paint shorthand paths on the parent context", () => {
    const computed: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: { basedOn: "#parent.background.color" },
      },
    }

    const context: Omit<ComputeContext, "theme"> = {
      properties: {},
      parentContext: {
        properties: {
          background: [
            {
              color: {
                type: ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
            },
          ],
        },
        parentContext: null,
      },
    }

    const result = getBasedOnValue(computed, context)
    expect(result).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    })
  })

  it("defaults high contrast basedOn to parent background color", () => {
    const computed: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {} as ComputedHighContrastValue["value"]["input"],
      },
    }

    const context: Omit<ComputeContext, "theme"> = {
      properties: {},
      parentContext: {
        properties: {
          background: [
            {
              color: {
                type: ValueType.EXACT,
                value: "#111111",
              },
            },
          ],
        },
        parentContext: null,
      },
    }

    const result = getBasedOnValue(computed, context)
    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#111111",
    })
  })
})
