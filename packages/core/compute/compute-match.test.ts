import { describe, expect, it } from "bun:test"
import {
  Color,
  ComputedFunction,
  ComputedMatchValue,
  Properties,
  ValueType,
} from "../index"
import testTheme from "../themes/test/test-theme"
import { computeMatch } from "./compute-match"

describe("computeMatch", () => {
  it("should match an exact value", () => {
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
      theme: testTheme,
    }

    const result = computeMatch(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#3b82f6",
    })
  })

  it("should match a theme value", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#font.size",
        },
      },
    }

    const properties: Properties = {
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeMatch(computedValue, context)

    expect(result).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    })
  })

  it("should match a parent value", () => {
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
      theme: testTheme,
    }

    const result = computeMatch(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#ef4444",
    })
  })

  it("should match a parent value with transparent handling", () => {
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
      theme: testTheme,
    }

    const result = computeMatch(computedValue, context)

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: "#10b981",
    })
  })

  it("should throw error when trying to match a computed value", () => {
    const computedValue: ComputedMatchValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.MATCH,
        input: {
          basedOn: "#size",
        },
      },
    }

    const properties: Properties = {
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#baseValue",
            factor: 1.5,
          },
        },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    expect(() => {
      computeMatch(computedValue, context)
    }).toThrow("The value being matched cannot be a computed value.")
  })

  it("should throw error when based on value is not found", () => {
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
      theme: testTheme,
    }

    expect(() => {
      computeMatch(computedValue, context)
    }).toThrow("Based on value not found for #missingValue.")
  })

  it("should throw error when parent based on value is not found", () => {
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
      theme: testTheme,
    }

    expect(() => {
      computeMatch(computedValue, context)
    }).toThrow("Based on value not found for #parent.missingValue.")
  })

  it("should match a preset value", () => {
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
      theme: testTheme,
    }

    const result = computeMatch(computedValue, context)

    expect(result).toEqual({
      type: ValueType.PRESET,
      value: Color.TRANSPARENT,
    })
  })
})
