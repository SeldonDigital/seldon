import { describe, expect, it } from "bun:test"
import { ThemeFont, ThemeSection, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getDropdownOptions } from "./get-dropdown-options"

describe("getDropdownOptions", () => {
  it("returns only standard options when no theme options are provided", () => {
    const params = {
      standardOptions: [
        { name: "Fill", value: "fill" },
        { name: "Fit", value: "fit" },
      ],
    }
    const expected = [
      [{ name: "None", value: "empty" }],
      [
        { name: "Fill", value: "fill" },
        { name: "Fit", value: "fit" },
      ],
    ]
    expect(getDropdownOptions(params)).toEqual(expected)
  })

  it("returns combined standard and theme options", () => {
    const params = {
      themeOptions: testTheme.margin,
      themeSection: "@margin" as `@${ThemeSection}`,
      standardOptions: [
        { name: "Fill", value: "fill" },
        { name: "Fit", value: "fit" },
      ],
    }
    const expected = [
      [{ name: "None", value: "empty" }],
      [
        { name: "Fill", value: "fill" },
        { name: "Fit", value: "fit" },
      ],
      [
        { name: "Tight", value: "@margin.tight" },
        { name: "Compact", value: "@margin.compact" },
        { name: "Cozy", value: "@margin.cozy" },
        { name: "Comfortable", value: "@margin.comfortable" },
        { name: "Open", value: "@margin.open" },
      ],
    ]
    expect(getDropdownOptions(params)).toEqual(expected)
  })

  it("filters options based on allowedValues", () => {
    const params = {
      themeOptions: testTheme.margin,
      themeSection: "@margin" as `@${ThemeSection}`,
      allowedValues: ["@margin.tight", "@margin.comfortable"],
    }
    const expected = [
      [{ name: "None", value: "empty" }],
      [
        { name: "Tight", value: "@margin.tight" },
        { name: "Comfortable", value: "@margin.comfortable" },
      ],
    ]
    expect(getDropdownOptions(params)).toEqual(expected)
  })

  it("adds custom presets", () => {
    const params = {
      themeOptions: {
        ...testTheme.font,
        custom1: {
          name: "Display Small",
          intent: "...",
          value: {
            weight: {
              type: ValueType.THEME_ORDINAL,
              value: "@fontWeight.semibold",
            },
            family: { type: ValueType.PRESET, value: "Barlow Condensed" },
            size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xsmall" },
            lineHeight: {
              type: ValueType.THEME_ORDINAL,
              value: "@lineHeight.solid",
            },
            textCase: { type: ValueType.PRESET, value: "normal" },
            letterSpacing: { type: ValueType.EMPTY, value: null },
          },
        } as ThemeFont,
      },
      themeSection: "@font" as `@${ThemeSection}`,
      allowedValues: ["@font.display"],
    }
    const expected = [
      [{ name: "None", value: "empty" }],
      [{ name: "Display", value: "@font.display" }],
      [{ name: "Display Small", value: "@font.custom1" }],
    ]
    expect(getDropdownOptions(params)).toEqual(expected)
  })

  it("returns an array with empty arrays when no options match allowedValues", () => {
    const params = {
      themeOptions: testTheme.margin,
      themeSection: "@margin" as `@${ThemeSection}`,
      allowedValues: ["nonExistingValue"],
    }
    expect(getDropdownOptions(params)).toEqual([
      [{ name: "None", value: "empty" }],
      [],
    ])
  })
})
