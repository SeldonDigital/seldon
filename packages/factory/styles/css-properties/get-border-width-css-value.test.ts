import { describe, expect, it } from "vitest"

import { BorderWidth, Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getBorderWidthCSSValue } from "./get-border-width-css-value"

describe("getBorderWidthCSSValue", () => {
  it("returns the hairline variable for the hairline option", () => {
    expect(
      getBorderWidthCSSValue(
        { type: ValueType.OPTION, value: BorderWidth.HAIRLINE },
        defaultTheme,
      ),
    ).toBe("var(--hairline)")
  })

  it("resolves an exact pixel width", () => {
    expect(
      getBorderWidthCSSValue(
        { type: ValueType.EXACT, value: { unit: Unit.PX, value: 2 } },
        defaultTheme,
      ),
    ).toBe("2px")
  })
})
