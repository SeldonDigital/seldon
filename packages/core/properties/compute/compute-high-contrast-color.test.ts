import { describe, expect, it } from "vitest"

import { STOCK_THEMES_BY_ID } from "../../themes/catalog"
import { computeTheme } from "../../themes/helpers/compute-theme"
import { ComputedFunction, ValueType } from "../constants"
import { computeHighContrastColor } from "./compute-high-contrast-color"
import type { ComputeContext } from "./types"

const computed = computeTheme(STOCK_THEMES_BY_ID.seldon)

const marker = {
  type: ValueType.COMPUTED,
  value: ComputedFunction.HIGH_CONTRAST_COLOR,
} as never

const ctx = (properties: Record<string, unknown>): ComputeContext =>
  ({
    properties,
    parentContext: null,
    theme: computed,
  }) as unknown as ComputeContext

describe("computeHighContrastColor", () => {
  it("returns an EXACT color for a light reference surface", () => {
    const result = computeHighContrastColor(marker, ctx({})) as {
      type: ValueType
    }
    expect(result.type).toBe(ValueType.EXACT)
  })

  it("picks opposite text colors for light and dark backgrounds", () => {
    const onLight = computeHighContrastColor(marker, ctx({}))
    const onDark = computeHighContrastColor(
      marker,
      ctx({
        background: [
          {
            color: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@swatch.black",
            },
          },
        ],
      }),
    )

    expect(JSON.stringify(onLight)).not.toBe(JSON.stringify(onDark))
  })
})
