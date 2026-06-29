import { describe, expect, it } from "vitest"

import { Corner, Margin, Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getAbsoluteSizeCssValue } from "./get-absolute-size-css-value"

describe("getAbsoluteSizeCssValue", () => {
  it("serializes an exact pixel value", () => {
    expect(
      getAbsoluteSizeCssValue(
        { type: ValueType.EXACT, value: { unit: Unit.PX, value: 12 } },
        defaultTheme,
      ),
    ).toBe("12px")
  })

  it("serializes an option value", () => {
    expect(
      getAbsoluteSizeCssValue(
        { type: ValueType.OPTION, value: Margin.NONE },
        defaultTheme,
      ),
    ).toBe("0")

    expect(
      getAbsoluteSizeCssValue(
        { type: ValueType.OPTION, value: Corner.SQUARED },
        defaultTheme,
      ),
    ).toBe("0px")
  })

  it("resolves a modulated theme ordinal token to a rem length", () => {
    const result = getAbsoluteSizeCssValue(
      { type: ValueType.THEME_ORDINAL, value: "@margin.compact" },
      defaultTheme,
    )
    expect(result).toMatch(/^-?[\d.]+rem$/)
  })

  it("throws when given a computed value", () => {
    expect(() =>
      getAbsoluteSizeCssValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { type: ValueType.COMPUTED, value: "opticalPadding" } as any,
        defaultTheme,
      ),
    ).toThrow(/computed value/)
  })
})
