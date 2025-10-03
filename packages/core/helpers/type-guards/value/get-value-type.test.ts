import { describe, expect, it } from "bun:test"
import { ValueType } from "../../../index"
import { getValueType } from "./get-value-type"

describe("getValueType", () => {
  it("should return PRESET for non-theme values", () => {
    const nonThemeValues = [
      "hello",
      "123",
      "",
      "fontSize",
      "color.primary",
      "@unknown.something",
      "@custom.value",
      "@newSection.item",
    ]

    nonThemeValues.forEach((value) => {
      expect(getValueType(value)).toBe(ValueType.PRESET)
    })
  })

  it("should return THEME_CATEGORICAL for categorical theme values", () => {
    const categoricalValues = [
      "@border.solid",
      "@border.hairline",
      "@border.curly",
      "@swatch.primary",
      "@swatch.secondary",
      "@swatch.accent",
      "@shadow.small",
      "@shadow.medium",
      "@shadow.large",
      "@gradient.primary",
      "@gradient.secondary",
      "@background.primary",
      "@background.secondary",
      "@color.primary",
      "@color.secondary",
      "@fontFamily.sans",
      "@fontFamily.serif",
      "@fontFamily.mono",
      "@font.primary",
      "@font.secondary",
    ]

    categoricalValues.forEach((value) => {
      expect(getValueType(value)).toBe(ValueType.THEME_CATEGORICAL)
    })
  })

  it("should return THEME_ORDINAL for ordinal theme values", () => {
    const ordinalValues = [
      "@borderWidth.thin",
      "@borderWidth.medium",
      "@borderWidth.thick",
      "@blur.small",
      "@blur.medium",
      "@blur.large",
      "@corners.small",
      "@corners.medium",
      "@corners.large",
      "@fontSize.small",
      "@fontSize.medium",
      "@fontSize.large",
      "@fontWeight.light",
      "@fontWeight.medium",
      "@fontWeight.bold",
      "@lineHeight.tight",
      "@lineHeight.normal",
      "@lineHeight.loose",
      "@size.small",
      "@size.medium",
      "@size.large",
      "@margin.small",
      "@margin.medium",
      "@margin.large",
      "@padding.small",
      "@padding.medium",
      "@padding.large",
      "@gap.small",
      "@gap.medium",
      "@gap.large",
      "@dimension.small",
      "@dimension.medium",
      "@dimension.large",
      "@spread.small",
      "@spread.medium",
      "@spread.large",
    ]

    ordinalValues.forEach((value) => {
      expect(getValueType(value)).toBe(ValueType.THEME_ORDINAL)
    })
  })

  it("should handle edge cases correctly", () => {
    const edgeCases = [
      { input: "@fontSize.small.extra", expected: ValueType.THEME_ORDINAL },
      { input: "@color.primary.dark", expected: ValueType.THEME_CATEGORICAL },
      { input: "@fontSize", expected: ValueType.THEME_ORDINAL },
      { input: "@color", expected: ValueType.THEME_CATEGORICAL },
      { input: "", expected: ValueType.PRESET },
      { input: "@", expected: ValueType.PRESET },
    ]

    edgeCases.forEach(({ input, expected }) => {
      expect(getValueType(input)).toBe(expected)
    })
  })
})
