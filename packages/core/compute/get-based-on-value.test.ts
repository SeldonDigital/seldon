import { describe, expect, it } from "bun:test"
import {
  Color,
  ComputedFunction,
  ComputedMatchValue,
  Properties,
  Unit,
  ValueType,
} from "../index"
import testTheme from "../themes/test/test-theme"
import { getBasedOnValue } from "./get-based-on-value"

describe("getBasedOnValue", () => {
  it("should get a value from current properties", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#color",
        },
      },
    }

    const properties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#3b82f6",
      },
    }

    const context = {
      properties,
      parentContext: null,
    }

    const result = getBasedOnValue(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#3b82f6",
    })
  })

  it("should get a value from parent properties", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#parent.color",
        },
      },
    }

    const parentProperties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#ef4444",
      },
    }

    const context = {
      properties: {} as Properties,
      parentContext: {
        properties: parentProperties,
        parentContext: null,
        theme: testTheme,
      },
    }

    const result = getBasedOnValue(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#ef4444",
    })
  })

  it("should get a value from grandparent when parent has transparent value", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#parent.color",
        },
      },
    }

    const grandparentProperties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#10b981",
      },
    }

    const parentProperties: Properties = {
      color: {
        type: ValueType.PRESET,
        value: Color.TRANSPARENT,
      },
    }

    const context = {
      properties: {} as Properties,
      parentContext: {
        properties: parentProperties,
        parentContext: {
          properties: grandparentProperties,
          parentContext: null,
          theme: testTheme,
        },
        theme: testTheme,
      },
    }

    const result = getBasedOnValue(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#10b981",
    })
  })

  it("should get a value from great-grandparent when parent and grandparent have transparent values", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#parent.color",
        },
      },
    }

    const greatGrandparentProperties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#8b5cf6",
      },
    }

    const grandparentProperties: Properties = {
      color: {
        type: ValueType.PRESET,
        value: Color.TRANSPARENT,
      },
    }

    const parentProperties: Properties = {
      color: {
        type: ValueType.PRESET,
        value: Color.TRANSPARENT,
      },
    }

    const context = {
      properties: {} as Properties,
      parentContext: {
        properties: parentProperties,
        parentContext: {
          properties: grandparentProperties,
          parentContext: {
            properties: greatGrandparentProperties,
            parentContext: null,
            theme: testTheme,
          },
          theme: testTheme,
        },
        theme: testTheme,
      },
    }

    const result = getBasedOnValue(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#8b5cf6",
    })
  })

  it("should get a theme value", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#buttonSize",
        },
      },
    }

    const properties: Properties = {
      buttonSize: {
        type: ValueType.THEME_ORDINAL,
        value: "@fontSize.medium",
      },
    }

    const context = {
      properties,
      parentContext: null,
    }

    const result = getBasedOnValue(computedValue, context)

    expect(result).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    })
  })

  it("should get a nested property value", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#parent.background.color",
        },
      },
    }

    const parentProperties: Properties = {
      background: {
        color: {
          type: ValueType.EXACT,
          value: "#f3f4f6",
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
    }

    const result = getBasedOnValue(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#f3f4f6",
    })
  })

  it("should throw error when value is not found", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#missingValue",
        },
      },
    }

    const context = {
      properties: {} as Properties,
      parentContext: null,
    }

    expect(() => {
      getBasedOnValue(computedValue, context)
    }).toThrow("Based on value not found for #missingValue.")
  })

  it("should throw error when parent value is not found", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#parent.missingValue",
        },
      },
    }

    const context = {
      properties: {} as Properties,
      parentContext: {
        properties: {} as Properties,
        parentContext: null,
        theme: testTheme,
      },
    }

    expect(() => {
      getBasedOnValue(computedValue, context)
    }).toThrow("Based on value not found for #parent.missingValue.")
  })

  it("should throw error when parent context is null but parent value is requested", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#parent.color",
        },
      },
    }

    const context = {
      properties: {} as Properties,
      parentContext: null,
    }

    expect(() => {
      getBasedOnValue(computedValue, context)
    }).toThrow("Based on value not found for #parent.color.")
  })

  it("should throw error when trying to get a compound value", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#padding",
        },
      },
    }

    const properties: Properties = {
      padding: {
        top: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
        bottom: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 10 },
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
    }

    expect(() => {
      getBasedOnValue(computedValue, context)
    }).toThrow("Based on value must be a primitive value, got")
  })

  it("should handle preset values correctly", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#color",
        },
      },
    }

    const properties: Properties = {
      color: {
        type: ValueType.PRESET,
        value: Color.TRANSPARENT,
      },
    }

    const context = {
      properties,
      parentContext: null,
    }

    const result = getBasedOnValue(computedValue, context)

    expect(result).toEqual({
      type: ValueType.PRESET,
      value: Color.TRANSPARENT,
    })
  })
})
