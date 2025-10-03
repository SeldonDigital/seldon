import { describe, expect, it } from "bun:test"
import { ComputedFunction, Properties, Unit, ValueType } from "../index"
import testTheme from "../themes/test/test-theme"
import { computeProperties } from "./compute-properties"

describe("computeProperties", () => {
  it("should compute properties with auto fit function", () => {
    const properties: Properties = {
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 2 },
      },
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#buttonSize",
            factor: 1.5,
          },
        },
      },
    }

    const result = computeProperties(properties, {
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 2 },
      },
      size: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 3 },
      },
    })
  })

  it("should compute properties with high contrast color function", () => {
    const properties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#000000",
        },
      },
      color: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.HIGH_CONTRAST_COLOR,
          input: {
            basedOn: "#background.color",
          },
        },
      },
    }

    const result = computeProperties(properties, {
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result.buttonSize).toBeUndefined()
    expect(result.background).toEqual({
      color: {
        type: ValueType.EXACT,
        value: "#000000",
      },
    })
    expect(result.color.type).toBe(ValueType.EXACT)
    expect(result.color.value).toHaveProperty("hue")
    expect(result.color.value).toHaveProperty("lightness")
    expect(result.color.value).toHaveProperty("saturation")
  })

  it("should compute properties with optical padding function", () => {
    const properties: Properties = {
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 10 },
      },
      padding: {
        top: {
          type: ValueType.COMPUTED,
          value: {
            function: ComputedFunction.OPTICAL_PADDING,
            input: {
              basedOn: "#buttonSize",
              factor: 2,
            },
          },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 5 },
        },
      },
    }

    const result = computeProperties(properties, {
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result.buttonSize).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 10 },
    })
    expect(result.padding.top).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 8 }, // 10 * 0.4 * 2 = 8
    })
    expect(result.padding.bottom).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 5 },
    })
  })

  it("should compute properties with match function", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#3b82f6",
      },
      accentColor: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.MATCH,
          input: {
            basedOn: "#color",
          },
        },
      },
    }

    const result = computeProperties(properties, {
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      color: {
        type: ValueType.EXACT,
        value: "#3b82f6",
      },
      accentColor: {
        type: ValueType.EXACT,
        value: "#3b82f6",
      },
    })
  })

  it("should handle mixed computed and non-computed properties", () => {
    const properties: Properties = {
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 1.5 },
      },
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#buttonSize",
            factor: 2.5,
          },
        },
      },
      color: {
        type: ValueType.EXACT,
        value: "#ef4444",
      },
      padding: {
        top: {
          type: ValueType.COMPUTED,
          value: {
            function: ComputedFunction.OPTICAL_PADDING,
            input: {
              basedOn: "#buttonSize",
              factor: 1.5,
            },
          },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 12 },
        },
      },
    }

    const result = computeProperties(properties, {
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result.buttonSize).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 1.5 },
    })
    expect(result.size).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 3.75 },
    })
    expect(result.color).toEqual({
      type: ValueType.EXACT,
      value: "#ef4444",
    })
    expect(result.padding.top).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 0.9 }, // 1.5 * 0.4 * 1.5 = 0.9
    })
    expect(result.padding.right).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 12 },
    })
  })

  it("should handle parent context for computed properties", () => {
    const parentProperties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#3b82f6",
      },
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 2 },
      },
    }

    const childProperties: Properties = {
      accentColor: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.MATCH,
          input: {
            basedOn: "#parent.color",
          },
        },
      },
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#parent.buttonSize",
            factor: 1.5,
          },
        },
      },
    }

    const result = computeProperties(childProperties, {
      properties: childProperties,
      parentContext: {
        properties: parentProperties,
        parentContext: null,
        theme: testTheme,
      },
      theme: testTheme,
    })

    expect(result.accentColor).toEqual({
      type: ValueType.EXACT,
      value: "#3b82f6",
    })
    expect(result.size).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 3 },
    })
  })

  it("should handle complex compound properties", () => {
    const properties: Properties = {
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 10 },
      },
      padding: {
        top: {
          type: ValueType.COMPUTED,
          value: {
            function: ComputedFunction.OPTICAL_PADDING,
            input: {
              basedOn: "#buttonSize",
              factor: 2,
            },
          },
        },
        right: {
          type: ValueType.COMPUTED,
          value: {
            function: ComputedFunction.OPTICAL_PADDING,
            input: {
              basedOn: "#buttonSize",
              factor: 1.5,
            },
          },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 5 },
        },
        left: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 8 },
        },
      },
      margin: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 12 },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 16 },
        },
      },
    }

    const result = computeProperties(properties, {
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result.buttonSize).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 10 },
    })
    expect(result.padding.top).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 8 }, // 10 * 0.4 * 2 = 8
    })
    expect(result.padding.right).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 12 }, // 10 * 0.8 * 1.5 = 12
    })
    expect(result.padding.bottom).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 5 },
    })
    expect(result.padding.left).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 8 },
    })
    expect(result.margin.top).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 12 },
    })
    expect(result.margin.right).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 16 },
    })
  })

  it("should handle empty properties object", () => {
    const properties: Properties = {}

    const result = computeProperties(properties, {
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({})
  })

  it("should handle properties with no computed values", () => {
    const properties: Properties = {
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 1.5 },
      },
      color: {
        type: ValueType.EXACT,
        value: "#ef4444",
      },
      padding: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
        right: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 12 },
        },
      },
    }

    const result = computeProperties(properties, {
      properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual(properties)
  })
})
