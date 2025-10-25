import { describe, expect, it } from "bun:test"
import { Properties, ValueType } from "@seldon/core"
import { Cursor } from "@seldon/core"
import { getCursorStyles } from "./get-cursor-styles"

describe("getCursorStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getCursorStyles({ properties })

    expect(result).toEqual({})
  })

  it("should return empty object when cursor is not defined", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    }

    const result = getCursorStyles({ properties })

    expect(result).toEqual({})
  })

  it("should generate cursor style for preset values", () => {
    const properties: Properties = {
      cursor: {
        type: ValueType.PRESET,
        value: Cursor.POINTER,
      },
    }

    const result = getCursorStyles({ properties })

    expect(result).toEqual({
      cursor: "pointer",
    })
  })

  it("should handle common cursor preset values", () => {
    const testCases = [
      { value: Cursor.DEFAULT, expected: "default" },
      { value: Cursor.POINTER, expected: "pointer" },
      { value: Cursor.GRAB, expected: "grab" },
      { value: Cursor.NOT_ALLOWED, expected: "not-allowed" },
      { value: Cursor.TEXT, expected: "text" },
      { value: Cursor.MOVE, expected: "move" },
      { value: Cursor.CROSSHAIR, expected: "crosshair" },
    ]

    testCases.forEach(({ value, expected }) => {
      const properties: Properties = {
        cursor: {
          type: ValueType.PRESET,
          value,
        },
      }

      const result = getCursorStyles({ properties })

      expect(result).toEqual({
        cursor: expected,
      })
    })
  })

  it("should handle empty cursor value", () => {
    const properties: Properties = {
      cursor: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getCursorStyles({ properties })

    expect(result).toEqual({})
  })

  it("should throw error for exact cursor type", () => {
    const properties: Properties = {
      cursor: {
        // @ts-expect-error
        type: ValueType.EXACT,
        // @ts-expect-error
        value: "pointer",
      },
    }

    expect(() => getCursorStyles({ properties })).toThrow(
      "Unknown cursor type: exact",
    )
  })

  it("should throw error for computed cursor type", () => {
    const properties: Properties = {
      cursor: {
        // @ts-expect-error
        type: ValueType.COMPUTED,
        // @ts-expect-error
        value: {
          function: "match" as const,
          input: { basedOn: "#parent.cursor" },
        },
      },
    }

    expect(() => getCursorStyles({ properties })).toThrow(
      "Unknown cursor type: computed",
    )
  })

  it("should throw error for theme categorical cursor type", () => {
    const properties: Properties = {
      cursor: {
        // @ts-expect-error
        type: ValueType.THEME_CATEGORICAL,
        // @ts-expect-error
        value: "@cursor.pointer",
      },
    }

    expect(() => getCursorStyles({ properties })).toThrow(
      "Unknown cursor type: theme.categorical",
    )
  })

  it("should throw error for theme ordinal cursor type", () => {
    const properties: Properties = {
      cursor: {
        // @ts-expect-error
        type: ValueType.THEME_ORDINAL,
        // @ts-expect-error
        value: "@cursor.medium",
      },
    }

    expect(() => getCursorStyles({ properties })).toThrow(
      "Unknown cursor type: theme.ordinal",
    )
  })

  it("should throw error for inherit cursor type", () => {
    const properties: Properties = {
      cursor: {
        // @ts-expect-error
        type: ValueType.INHERIT,
        value: null,
      },
    }

    expect(() => getCursorStyles({ properties })).toThrow(
      "Unknown cursor type: inherit",
    )
  })

  it("should only return cursor property and ignore other properties", () => {
    const properties: Properties = {
      cursor: {
        type: ValueType.PRESET,
        value: Cursor.GRAB,
      },
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    }

    const result = getCursorStyles({ properties })

    expect(result).toEqual({
      cursor: "grab",
    })
  })

  it("should handle cursor with only cursor property", () => {
    const properties: Properties = {
      cursor: {
        type: ValueType.PRESET,
        value: Cursor.NOT_ALLOWED,
      },
    }

    const result = getCursorStyles({ properties })

    expect(result).toEqual({
      cursor: "not-allowed",
    })
  })
})
