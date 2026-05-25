import { describe, expect, it } from "bun:test"
import { Display, Properties, ValueType } from "@seldon/core"
import { getDisplayStyles } from "./get-display-styles"

describe("getDisplayStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getDisplayStyles({ properties })

    expect(result).toEqual({})
  })

  it("should set display to none for EXCLUDE value", () => {
    const properties: Properties = {
      display: {
        type: ValueType.PRESET,
        value: Display.EXCLUDE,
      },
    }

    const result = getDisplayStyles({ properties })

    expect(result).toEqual({
      display: "none",
    })
  })

  it("should set visibility to hidden for HIDE value", () => {
    const properties: Properties = {
      display: {
        type: ValueType.PRESET,
        value: Display.HIDE,
      },
    }

    const result = getDisplayStyles({ properties })

    expect(result).toEqual({
      visibility: "hidden",
    })
  })

  it("should return empty object for SHOW value", () => {
    const properties: Properties = {
      display: {
        type: ValueType.PRESET,
        value: Display.SHOW,
      },
    }

    const result = getDisplayStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object for empty display value", () => {
    const properties: Properties = {
      display: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getDisplayStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle undefined display property", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    }

    const result = getDisplayStyles({ properties })

    expect(result).toEqual({})
  })

  it("should handle all valid display preset values", () => {
    const testCases = [
      { value: Display.SHOW, expected: {} },
      { value: Display.HIDE, expected: { visibility: "hidden" as const } },
      { value: Display.EXCLUDE, expected: { display: "none" as const } },
    ]

    testCases.forEach(({ value, expected }) => {
      const properties: Properties = {
        display: {
          type: ValueType.PRESET,
          value,
        },
      }

      const result = getDisplayStyles({ properties })

      expect(result).toEqual(expected)
    })
  })

  it("should not affect other properties", () => {
    const properties: Properties = {
      display: {
        type: ValueType.PRESET,
        value: Display.EXCLUDE,
      },
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
        },
      },
    }

    const result = getDisplayStyles({ properties })

    expect(result).toEqual({
      display: "none",
    })
    expect(result).not.toHaveProperty("color")
    expect(result).not.toHaveProperty("font")
  })

  it("should handle properties with only display property", () => {
    const properties: Properties = {
      display: {
        type: ValueType.PRESET,
        value: Display.HIDE,
      },
    }

    const result = getDisplayStyles({ properties })

    expect(result).toEqual({
      visibility: "hidden",
    })
  })
})
