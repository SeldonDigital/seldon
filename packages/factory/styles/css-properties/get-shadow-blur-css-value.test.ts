import { Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"
import { describe, expect, it } from "vitest"

import { getShadowBlurCSSValue } from "./get-shadow-blur-css-value"

describe("getShadowBlurCSSValue", () => {
  it("serializes an exact pixel blur", () => {
    expect(
      getShadowBlurCSSValue({
        blur: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 8 } },
        theme: defaultTheme,
      }),
    ).toBe("8px")
  })

  it("returns an empty string for an empty blur", () => {
    expect(
      getShadowBlurCSSValue({
        blur: { type: ValueType.EMPTY, value: null },
        theme: defaultTheme,
      }),
    ).toBe("")
  })
})
