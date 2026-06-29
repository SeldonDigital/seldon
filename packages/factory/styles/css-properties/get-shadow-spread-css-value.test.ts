import { describe, expect, it } from "vitest"

import { Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getShadowSpreadCSSValue } from "./get-shadow-spread-css-value"

describe("getShadowSpreadCSSValue", () => {
  it("serializes an exact rem spread", () => {
    expect(
      getShadowSpreadCSSValue({
        spread: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 0.5 },
        },
        theme: defaultTheme,
      }),
    ).toBe("0.5rem")
  })

  it("returns an empty string for an empty spread", () => {
    expect(
      getShadowSpreadCSSValue({
        spread: { type: ValueType.EMPTY, value: null },
        theme: defaultTheme,
      }),
    ).toBe("")
  })
})
