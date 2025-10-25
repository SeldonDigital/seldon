import { describe, expect, it } from "bun:test"
import { Properties, Unit, ValueType } from "@seldon/core"
import { Display } from "@seldon/core/properties"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getIconStyles } from "./get-icon-styles"

describe("getIconStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({})
  })

  it("should return empty object when symbol is not defined", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 16 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({})
  })

  it("should generate fontSize style for symbol with size", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 24 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "24px",
    })
  })

  it("should generate color style for symbol with color", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      color: "#ff0000",
    })
  })

  it("should generate both fontSize and color styles", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 20 },
      },
      color: {
        type: ValueType.EXACT,
        value: "#00ff00",
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "20px",
      color: "#00ff00",
    })
  })

  it("should handle rem size values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-check",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 1.5 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "1.5rem",
    })
  })

  it("should handle percentage size values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-close",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 1.2 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "1.2rem",
    })
  })

  it("should handle theme categorical color values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-star",
      },
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      color: "hsl(0 0% 15%)",
    })
  })

  it("should handle theme ordinal size values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-favorite",
      },
      size: {
        type: ValueType.THEME_ORDINAL,
        value: "@size.medium",
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "1rem",
    })
  })

  it("should handle preset color values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-info",
      },
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.white",
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      color: "hsl(0 12% 98%)",
    })
  })

  it("should handle HSL color values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-warning",
      },
      color: {
        type: ValueType.EXACT,
        value: { hue: 0, saturation: 100, lightness: 50 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      color: "hsl(0 100% 50%)",
    })
  })

  it("should handle RGB color values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-error",
      },
      color: {
        type: ValueType.EXACT,
        value: { red: 255, green: 0, blue: 0 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      color: "rgb(255 0 0)",
    })
  })

  it("should handle LCH color values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-checkCircle",
      },
      color: {
        type: ValueType.EXACT,
        value: { lightness: 50, chroma: 100, hue: 0 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      color: "lch(50% 100 0deg)",
    })
  })

  it("should handle color with brightness adjustment", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-darkMode",
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
      brightness: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 20 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      color: "hsl(0 100% 60%)",
    })
  })

  it("should handle empty symbol value", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.EMPTY,
        value: null,
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 16 },
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({})
  })

  it("should handle empty size value", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EMPTY,
        value: null,
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      color: "#ff0000",
    })
  })

  it("should handle empty color value", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 16 },
      },
      color: {
        type: ValueType.EMPTY,
        value: null,
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "16px",
    })
  })

  it("should handle zero size values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 0 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "0px",
    })
  })

  it("should handle negative size values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: -10 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "-10px",
    })
  })

  it("should handle decimal size values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 16.5 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "16.5px",
    })
  })

  it("should handle large size values", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 9999 },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "9999px",
    })
  })

  it("should handle icon with other properties", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 20 },
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
      display: {
        type: ValueType.PRESET,
        value: Display.SHOW,
      },
      margin: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({
      fontSize: "20px",
      color: "#ff0000",
    })
  })

  it("should handle icon with only symbol property", () => {
    const properties: Properties = {
      symbol: {
        type: ValueType.PRESET,
        value: "material-arrowRight",
      },
    }
    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getIconStyles(context)

    expect(result).toEqual({})
  })

  it("should handle different icon symbols", () => {
    const symbols = [
      "material-arrowRight",
      "material-arrowLeft",
      "material-arrowUpward",
      "material-arrowDownward",
      "material-check",
      "material-close",
      "material-star",
      "material-favorite",
      "material-info",
      "material-warning",
      "material-error",
      "material-checkCircle",
    ]

    symbols.forEach((symbol) => {
      const properties: Properties = {
        symbol: {
          type: ValueType.PRESET,
          value: symbol,
        },
        size: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
        color: {
          type: ValueType.EXACT,
          value: "#000000",
        },
      }
      const context = {
        properties,
        parentContext: null,
        theme: testTheme,
      }

      const result = getIconStyles(context)

      expect(result).toEqual({
        fontSize: "16px",
        color: "#000000",
      })
    })
  })
})
