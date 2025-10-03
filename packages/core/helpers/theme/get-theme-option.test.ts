import { describe, expect, it } from "bun:test"
import testTheme from "../../themes/test/test-theme"
import { getThemeOption } from "./get-theme-option"

describe("getThemeOption", () => {
  it("should get theme options correctly", () => {
    const testCases = [
      { key: "@fontFamily.primary", expected: testTheme.fontFamily.primary },
      { key: "@fontSize.medium", expected: testTheme.fontSize.medium },
      { key: "@fontWeight.bold", expected: testTheme.fontWeight.bold },
      { key: "@lineHeight.tight", expected: testTheme.lineHeight.tight },
      { key: "@margin.cozy", expected: testTheme.margin.cozy },
      { key: "@padding.comfortable", expected: testTheme.padding.comfortable },
      { key: "@gap.cozy", expected: testTheme.gap.cozy },
      { key: "@size.large", expected: testTheme.size.large },
      { key: "@dimension.medium", expected: testTheme.dimension.medium },
      { key: "@swatch.primary", expected: testTheme.swatch.primary },
      { key: "@borderWidth.medium", expected: testTheme.borderWidth.medium },
      { key: "@corners.cozy", expected: testTheme.corners.cozy },
      { key: "@shadow.light", expected: testTheme.shadow.light },
      { key: "@scrollbar.primary", expected: testTheme.scrollbar.primary },
      { key: "@gradient.primary", expected: testTheme.gradient.primary },
      { key: "@background.primary", expected: testTheme.background.primary },
      { key: "@blur.medium", expected: testTheme.blur.medium },
      { key: "@spread.medium", expected: testTheme.spread.medium },
      { key: "@border.thin", expected: testTheme.border.thin },
    ]

    testCases.forEach(({ key, expected }) => {
      const result = getThemeOption(key, testTheme)
      expect(result).toEqual(expected)
    })
  })

  it("should throw error for invalid theme keys", () => {
    const invalidKeys = [
      "invalid-key",
      "@nonexistent.medium",
      "@fontSize.nonexistent",
      "fontSize.medium",
      "",
      "@",
      "@fontSize",
    ]

    const expectedErrors = [
      "invalid-key is not a valid theme value",
      "Theme value @nonexistent.medium not found",
      "Theme value @fontSize.nonexistent not found",
      "fontSize.medium is not a valid theme value",
      " is not a valid theme value",
      "@ is not a valid theme value",
      "@fontSize is not a valid theme value",
    ]

    invalidKeys.forEach((key, index) => {
      expect(() => {
        getThemeOption(key, testTheme)
      }).toThrow(expectedErrors[index])
    })
  })

  it("should work with different options within same section", () => {
    const fontSizeResults = [
      getThemeOption("@fontSize.small", testTheme),
      getThemeOption("@fontSize.medium", testTheme),
      getThemeOption("@fontSize.large", testTheme),
    ]

    const swatchResults = [
      getThemeOption("@swatch.background", testTheme),
      getThemeOption("@swatch.custom1", testTheme),
    ]

    expect(fontSizeResults[0]).toEqual(testTheme.fontSize.small)
    expect(fontSizeResults[1]).toEqual(testTheme.fontSize.medium)
    expect(fontSizeResults[2]).toEqual(testTheme.fontSize.large)

    expect(swatchResults[0]).toEqual(testTheme.swatch.background)
    expect(swatchResults[1]).toEqual(testTheme.swatch.custom1)

    // Values should be different
    expect(fontSizeResults[0]).not.toEqual(fontSizeResults[1])
    expect(fontSizeResults[1]).not.toEqual(fontSizeResults[2])
    expect(swatchResults[0]).not.toEqual(swatchResults[1])
  })
})
