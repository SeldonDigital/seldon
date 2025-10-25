import { describe, expect, it } from "bun:test"
import { Align, Properties, TextAlign, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getTextStyles } from "./get-text-styles"

describe("getTextStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should generate font size and line height styles", () => {
    const properties: Properties = {
      font: {
        size: { type: ValueType.EXACT, value: { value: 16, unit: Unit.PX } },
        lineHeight: {
          type: ValueType.EXACT,
          value: { value: 1.5, unit: Unit.NUMBER },
        },
      },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      fontSize: "16px",
      lineHeight: 1.5,
    })
  })

  it("should generate font size with rem and line height with percentage", () => {
    const properties: Properties = {
      font: {
        size: { type: ValueType.EXACT, value: { value: 1, unit: Unit.REM } },
        lineHeight: {
          type: ValueType.EXACT,
          value: { value: 150, unit: Unit.PERCENT },
        },
      },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      fontSize: "1rem",
      lineHeight: "150%",
    })
  })

  it("should generate font size from theme ordinal values", () => {
    const properties: Properties = {
      font: {
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.large" },
      },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      fontSize: "1.501rem",
    })
  })

  it("should not set color if gradient value is present", () => {
    const properties: Properties = {
      gradient: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@gradient.primary",
        },
      },
      font: {
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.large" },
      },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      fontSize: "1.501rem",
    })
  })

  it("should generate text align center style", () => {
    const properties: Properties = {
      textAlign: { type: ValueType.PRESET, value: TextAlign.CENTER },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      textAlign: "center",
    })
  })

  it("should generate text align right style", () => {
    const properties: Properties = {
      textAlign: { type: ValueType.PRESET, value: TextAlign.RIGHT },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      textAlign: "right",
    })
  })

  it("should generate font preset styles", () => {
    const properties: Properties = {
      font: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@font.heading" },
        size: { type: ValueType.EMPTY, value: null },
        family: { type: ValueType.EMPTY, value: null },
        weight: { type: ValueType.EMPTY, value: null },
        lineHeight: { type: ValueType.EMPTY, value: null },
      },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      fontFamily: "Inter",
      fontSize: "2.002rem",
      fontWeight: 600,
      lineHeight: 1.25,
    })
  })

  it("should override font preset with specific values", () => {
    const properties: Properties = {
      font: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@font.heading" },
        lineHeight: {
          type: ValueType.EXACT,
          value: { value: 1.5, unit: Unit.NUMBER },
        },
        size: { type: ValueType.EMPTY, value: null },
        family: { type: ValueType.EMPTY, value: null },
        weight: { type: ValueType.EMPTY, value: null },
      },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      fontFamily: "Inter",
      fontSize: "2.002rem",
      fontWeight: 600,
      lineHeight: 1.5,
    })
  })

  it("should handle empty font properties", () => {
    const properties: Properties = {
      font: {
        size: { type: ValueType.EMPTY, value: null },
        family: { type: ValueType.EMPTY, value: null },
        weight: { type: ValueType.EMPTY, value: null },
        lineHeight: { type: ValueType.EMPTY, value: null },
      },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should handle undefined font properties", () => {
    const properties: Properties = {
      font: undefined,
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should handle invalid text alignment gracefully", () => {
    const properties: Properties = {
      textAlign: { type: ValueType.EMPTY, value: null },
    }

    const result = getTextStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })
})
