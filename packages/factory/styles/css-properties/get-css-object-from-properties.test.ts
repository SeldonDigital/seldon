import { describe, expect, it } from "bun:test"
import { ComputedFunction, Properties, Unit, ValueType } from "@seldon/core"
import { BorderStyle } from "@seldon/core/properties/constants/border-styles"
import testTheme from "@seldon/core/themes/test/test-theme"
import { StyleGenerationContext } from "../types"
import { getCssObjectFromProperties } from "./get-css-object-from-properties"

describe("getCssObjectFromProperties", () => {
  it("should return empty object when properties are empty", () => {
    const properties: Properties = {}
    const context: StyleGenerationContext = {
      properties: {},
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({})
  })

  it("should compute properties before generating styles", () => {
    const properties: Properties = {
      color: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.MATCH,
          input: { basedOn: "#parent.color" },
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
      parentContext: {
        properties: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
        parentContext: null,
        theme: testTheme,
      },
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      color: "hsl(0 0% 15%)", // Primary color from parent
    })
  })

  it("should generate styles from multiple property types", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      font: {
        size: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 1.5 },
        },
      },
      padding: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      color: "hsl(0 0% 15%)",
      fontSize: "1.5rem",
      padding: "16px", // Shorthand applied
    })
  })

  it("should remove undefined values from styles", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      // fontSize is intentionally missing to test undefined removal
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      color: "hsl(0 0% 15%)",
    })
    expect(result.fontSize).toBeUndefined()
  })

  it("should apply CSS shorthands for matching values", () => {
    const properties: Properties = {
      margin: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 12 },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 12 },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 12 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 12 },
        },
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      margin: "12px", // Shorthand applied
    })
  })

  it("should not apply shorthands when values differ", () => {
    const properties: Properties = {
      padding: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 8 },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 8 },
        },
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      paddingTop: "16px",
      paddingRight: "8px",
      paddingBottom: "16px",
      paddingLeft: "8px",
    })
    expect(result.padding).toBeUndefined()
  })

  it("should handle background styles with original properties", () => {
    const properties: Properties = {
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        image: {
          type: ValueType.EXACT,
          value: "url('/test-image.jpg')",
        },
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      backgroundColor: "hsl(0 0% 15%)",
      backgroundImage: "url(url('/test-image.jpg'))", // Double url() wrapper
    })
  })

  it("should handle layout styles with both computed and original properties", () => {
    const properties: Properties = {
      gap: {
        type: ValueType.THEME_ORDINAL,
        value: "@gap.comfortable",
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      gap: "2.002rem", // Theme value resolved
    })
  })

  it("should handle font properties", () => {
    const properties: Properties = {
      font: {
        size: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 1 },
        },
        lineHeight: {
          type: ValueType.EXACT,
          value: { unit: Unit.NUMBER, value: 1.5 },
        },
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      fontSize: "1rem",
      lineHeight: 1.5,
    })
  })

  it("should handle theme-based properties", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.large",
        },
      },
      margin: {
        top: {
          type: ValueType.THEME_ORDINAL,
          value: "@margin.comfortable",
        },
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      color: "hsl(0 0% 15%)",
      fontSize: "1.501rem",
      marginTop: "2.002rem", // Theme value resolved
    })
  })

  it("should handle empty and undefined properties gracefully", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EMPTY,
        value: null,
      },
      font: {
        size: {
          type: ValueType.EMPTY,
          value: null,
        },
      },
      // Some properties are completely missing
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      color: "", // Empty value still generates empty string
    })
  })

  it("should handle parent context for computed properties", () => {
    const properties: Properties = {
      color: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.HIGH_CONTRAST_COLOR,
          input: { basedOn: "#parent.background.color" },
        },
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: {
        properties: {
          background: {
            color: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@swatch.primary",
            },
          },
        },
        parentContext: null,
        theme: testTheme,
      },
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      color: "hsl(0 12% 98%)", // High contrast color computed from parent background
    })
  })

  it("should process all style functions in correct order", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 80 },
      },
    }

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({
      color: "hsl(0 0% 15%)",
      opacity: 0.8, // Opacity as decimal
    })
  })

  it("should handle border shorthand generation", () => {
    const properties: Properties = {
      border: {
        width: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 2 },
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

    const context: StyleGenerationContext = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getCssObjectFromProperties(properties, context)

    expect(result).toEqual({}) // No border styles generated
  })
})
