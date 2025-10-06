import { describe, expect, it } from "bun:test"
import { ComputedFunction, Properties, Unit, ValueType } from "@seldon/core"
import { BorderStyle } from "@seldon/core/properties/constants/border-styles"
import testTheme from "@seldon/core/themes/test/test-theme"
import { StyleGenerationContext } from "../types"
import { getCssFromProperties } from "./get-css-from-properties"

describe("getCssFromProperties", () => {
  it("should return empty string when properties are empty", () => {
    const properties: Properties = {}

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual("")
  })

  it("should return font styles when font preset is set", () => {
    const properties: Properties = {
      font: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@font.title",
        },
        size: { type: ValueType.EMPTY, value: null },
        family: { type: ValueType.EMPTY, value: null },
        weight: { type: ValueType.EMPTY, value: null },
        lineHeight: { type: ValueType.EMPTY, value: null },
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual(
      ".button {font-family: Inter;\nfont-weight: 500;\nfont-size: 1rem;\nline-height: 1.25;}",
    )
  })

  it("should override font preset with explicit font size", () => {
    const properties: Properties = {
      font: {
        preset: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@font.title",
        },
        size: { type: ValueType.EXACT, value: { value: 10, unit: Unit.REM } },
        family: { type: ValueType.EMPTY, value: null },
        weight: { type: ValueType.EMPTY, value: null },
        lineHeight: { type: ValueType.EMPTY, value: null },
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual(
      ".button {font-family: Inter;\nfont-weight: 500;\nfont-size: 10rem;\nline-height: 1.25;}",
    )
  })

  it("should return color styles when color property is set", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual(".button {color: hsl(0 0% 15%);}")
  })

  it("should return background styles when background color is set", () => {
    const properties: Properties = {
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual("")
  })

  it("should return border styles when border properties are set", () => {
    const properties: Properties = {
      border: {
        width: {
          type: ValueType.EXACT,
          value: { value: 2, unit: Unit.PX },
        },
        style: {
          type: ValueType.PRESET,
          value: BorderStyle.SOLID,
        },
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual("")
  })

  it("should return margin styles when margin properties are set", () => {
    const properties: Properties = {
      margin: {
        top: {
          type: ValueType.EXACT,
          value: { value: 16, unit: Unit.PX },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { value: 16, unit: Unit.PX },
        },
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual(".button {margin-top: 16px;\nmargin-bottom: 16px;}")
  })

  it("should return padding styles when padding properties are set", () => {
    const properties: Properties = {
      padding: {
        top: {
          type: ValueType.EXACT,
          value: { value: 8, unit: Unit.PX },
        },
        right: {
          type: ValueType.EXACT,
          value: { value: 16, unit: Unit.PX },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { value: 8, unit: Unit.PX },
        },
        left: {
          type: ValueType.EXACT,
          value: { value: 16, unit: Unit.PX },
        },
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual(
      ".button {padding-top: 8px;\npadding-right: 16px;\npadding-bottom: 8px;\npadding-left: 16px;}",
    )
  })

  it("should combine multiple style properties", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
      },
      padding: {
        top: {
          type: ValueType.EXACT,
          value: { value: 12, unit: Unit.PX },
        },
        right: {
          type: ValueType.EXACT,
          value: { value: 24, unit: Unit.PX },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { value: 12, unit: Unit.PX },
        },
        left: {
          type: ValueType.EXACT,
          value: { value: 24, unit: Unit.PX },
        },
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual(
      ".button {color: hsl(0 0% 15%);\npadding-top: 12px;\npadding-right: 24px;\npadding-bottom: 12px;\npadding-left: 24px;}",
    )
  })

  it("should handle empty values by including them as empty CSS values", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EMPTY,
        value: null,
      },
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
    }

    const result = getCssFromProperties(
      properties,
      {
        properties: {},
        parentContext: null,
        theme: testTheme,
      },
      "button",
    )

    expect(result).toEqual(".button {color: ;}")
  })

  it("should handle computed properties by resolving them", () => {
    const properties: Properties = {
      color: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.MATCH,
          input: {
            basedOn: "#color",
          },
        },
      },
    }

    const context: StyleGenerationContext = {
      properties: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssFromProperties(properties, context, "button")

    expect(result).toEqual(".button {color: hsl(0 0% 15%);}")
  })
})
