import { describe, expect, it } from "bun:test"
import { ThemeOptionId, ThemeSection, ThemeValueKey } from "../../themes/types"
import { getThemeKeyComponents } from "./get-theme-key-components"

describe("getThemeKeyComponents", () => {
  it("should parse theme keys correctly", () => {
    const testCases: Array<{
      input: ThemeValueKey
      expected: { section: ThemeSection; optionId: ThemeOptionId }
    }> = [
      {
        input: "@fontSize.medium",
        expected: { section: "fontSize", optionId: "medium" },
      },
      {
        input: "@swatch.primary",
        expected: { section: "swatch", optionId: "primary" },
      },
      {
        input: "@margin.comfortable",
        expected: { section: "margin", optionId: "comfortable" },
      },
      {
        input: "@padding.cozy",
        expected: { section: "padding", optionId: "cozy" },
      },
      {
        input: "@fontWeight.bold",
        expected: { section: "fontWeight", optionId: "bold" },
      },
      {
        input: "@lineHeight.comfortable",
        expected: { section: "lineHeight", optionId: "comfortable" },
      },
      {
        input: "@size.xlarge",
        expected: { section: "size", optionId: "xlarge" },
      },
      {
        input: "@dimension.large",
        expected: { section: "dimension", optionId: "large" },
      },
      {
        input: "@gap.comfortable",
        expected: { section: "gap", optionId: "comfortable" },
      },
      {
        input: "@corners.cozy",
        expected: { section: "corners", optionId: "cozy" },
      },
      {
        input: "@shadow.strong",
        expected: { section: "shadow", optionId: "strong" },
      },
      {
        input: "@border.thick",
        expected: { section: "border", optionId: "thick" },
      },
      {
        input: "@gradient.primary",
        expected: { section: "gradient", optionId: "primary" },
      },
      {
        input: "@background.primary",
        expected: { section: "background", optionId: "primary" },
      },
      {
        input: "@scrollbar.primary",
        expected: { section: "scrollbar", optionId: "primary" },
      },
    ]

    testCases.forEach(({ input, expected }) => {
      const result = getThemeKeyComponents(input)
      expect(result).toEqual(expected)
    })
  })

  it("should throw error for invalid theme keys", () => {
    const invalidKeys = [
      "fontSize.medium",
      "@fontSize",
      "@fontSize.",
      "@.medium",
      "@fontSize.medium.extra",
      "not-a-theme-key",
      "",
    ]

    invalidKeys.forEach((key) => {
      expect(() => {
        getThemeKeyComponents(key as unknown as ThemeValueKey)
      }).toThrow()
    })
  })
})
