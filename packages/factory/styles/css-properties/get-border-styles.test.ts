import { describe, expect, it } from "bun:test"
import { BorderStyle, Properties, Unit, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getBorderStyles } from "./get-border-styles"

describe("getBorderStyles", () => {
  it("should return an empty object when no border properties are set", () => {
    const properties: Properties = {}

    const result = getBorderStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should apply theme border preset to all sides", () => {
    const properties: Properties = {
      border: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.normal" },
      },
    }

    const result = getBorderStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should override individual border side properties", () => {
    const properties: Properties = {
      border: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.normal" },
        topWidth: { type: ValueType.EXACT, value: { value: 2, unit: Unit.PX } },
        topStyle: { type: ValueType.PRESET, value: BorderStyle.DOTTED },
        topColor: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
        topOpacity: {
          type: ValueType.EXACT,
          value: { value: 50, unit: Unit.PERCENT },
        },
      },
    }

    const result = getBorderStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      borderTopColor: "hsl(0 12% 98% / 50%)",
      borderTopStyle: "dotted",
      borderTopWidth: "2px",
    })
  })

  it("should handle border properties without preset", () => {
    const properties: Properties = {
      border: {
        topWidth: { type: ValueType.EXACT, value: { value: 1, unit: Unit.PX } },
        topStyle: { type: ValueType.PRESET, value: BorderStyle.SOLID },
        topColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
    }

    const result = getBorderStyles({
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      borderTopColor: "hsl(0 0% 15%)",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
    })
  })
})
