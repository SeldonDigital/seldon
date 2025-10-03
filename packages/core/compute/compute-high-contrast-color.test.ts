import { describe, expect, it } from "bun:test"
import {
  ComputedFunction,
  ComputedHighContrastValue,
  Properties,
  Unit,
  ValueType,
} from "../index"
import testTheme from "../themes/test/test-theme"
import { computeHighContrastColor } from "./compute-high-contrast-color"

describe("computeHighContrastColor", () => {
  it("should return high contrast color for dark background", () => {
    const computedValue: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#background.color",
        },
      },
    }

    const properties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#000000",
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeHighContrastColor(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { hue: 0, lightness: 98, saturation: 12 },
    })
  })

  it("should return high contrast color for light background", () => {
    const computedValue: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#background.color",
        },
      },
    }

    const properties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#ffffff",
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeHighContrastColor(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { hue: 0, lightness: 8, saturation: 12 },
    })
  })

  it("should return high contrast color for dark background with positive brightness", () => {
    const computedValue: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#background.color",
        },
      },
    }

    const properties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#000000",
        },
        brightness: {
          type: ValueType.EXACT,
          value: { value: 20, unit: Unit.PERCENT },
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeHighContrastColor(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { hue: 0, lightness: 98, saturation: 12 },
    })
  })

  it("should return high contrast color for light background with negative brightness", () => {
    const computedValue: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#background.color",
        },
      },
    }

    const properties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#ffffff",
        },
        brightness: {
          type: ValueType.EXACT,
          value: { value: -30, unit: Unit.PERCENT },
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeHighContrastColor(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { hue: 0, lightness: 8, saturation: 12 },
    })
  })

  it("should return high contrast color from parent context", () => {
    const computedValue: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#parent.background.color",
        },
      },
    }

    const parentProperties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#000000",
        },
        brightness: {
          type: ValueType.EXACT,
          value: { value: 50, unit: Unit.PERCENT },
        },
      },
    }

    const context = {
      properties: {} as Properties,
      parentContext: {
        properties: parentProperties,
        parentContext: null,
        theme: testTheme,
      },
      theme: testTheme,
    }

    const result = computeHighContrastColor(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { hue: 0, lightness: 98, saturation: 12 },
    })
  })

  it("should ignore brightness when value is 0", () => {
    const computedValue: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#background.color",
        },
      },
    }

    const properties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#000000",
        },
        brightness: {
          type: ValueType.EXACT,
          value: { value: 0, unit: Unit.PERCENT },
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeHighContrastColor(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { hue: 0, lightness: 98, saturation: 12 },
    })
  })

  it("should handle medium gray background correctly", () => {
    const computedValue: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#background.color",
        },
      },
    }

    const properties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#808080",
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeHighContrastColor(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { hue: 0, lightness: 98, saturation: 12 },
    })
  })

  it("should handle theme categorical color values", () => {
    const computedValue: ComputedHighContrastValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#background.color",
        },
      },
    }

    const properties: Properties = {
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeHighContrastColor(computedValue, context)

    expect(result.type).toBe(ValueType.EXACT)
    expect(result.value).toHaveProperty("hue")
    expect(result.value).toHaveProperty("lightness")
    expect(result.value).toHaveProperty("saturation")
  })
})
