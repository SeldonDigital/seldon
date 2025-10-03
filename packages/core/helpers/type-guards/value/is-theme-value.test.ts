import { describe, expect, it } from "bun:test"
import { Resize, ValueType } from "../../../index"
import { PrimitiveValue } from "../../../properties/types/primitive-value"
import { isThemeValue } from "./is-theme-value"

describe("isThemeValue", () => {
  it("should return true for theme values", () => {
    const themeValues: PrimitiveValue[] = [
      {
        type: ValueType.THEME_ORDINAL,
        value: "@gap.comfortable",
      },
      {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      {
        type: ValueType.THEME_ORDINAL,
        value: "@fontSize.large",
      },
      {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.swatch1",
      },
    ]

    themeValues.forEach((value) => {
      expect(isThemeValue(value)).toBe(true)
    })
  })

  it("should return false for non-theme values", () => {
    const nonThemeValues: PrimitiveValue[] = [
      {
        type: ValueType.PRESET,
        value: Resize.FILL,
      },
      {
        type: ValueType.EXACT,
        value: "#000000",
      },
      {
        type: ValueType.EMPTY,
        value: null,
      },
    ]

    nonThemeValues.forEach((value) => {
      expect(isThemeValue(value)).toBe(false)
    })
  })
})
