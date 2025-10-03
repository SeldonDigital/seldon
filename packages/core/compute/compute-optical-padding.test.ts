import { describe, expect, it } from "bun:test"
import {
  ComputedFunction,
  ComputedOpticalPaddingValue,
  Properties,
  Unit,
  ValueType,
} from "../index"
import testTheme from "../themes/test/test-theme"
import { computeOpticalPadding } from "./compute-optical-padding"

describe("computeOpticalPadding", () => {
  it("should compute the optical padding without a unit value", () => {
    const computedValue: ComputedOpticalPaddingValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: { basedOn: "#lines", factor: 2 },
      },
    }

    const properties: Properties = {
      lines: { type: ValueType.EXACT, value: 10 },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
      subPropertyKey: "top",
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: 8,
    })
  })

  it("should compute the optical padding with a unit value", () => {
    const computedValue: ComputedOpticalPaddingValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: { basedOn: "#buttonSize", factor: 0.8 },
      },
    }

    const properties: Properties = {
      buttonSize: {
        type: ValueType.EXACT,
        value: { value: 10, unit: Unit.PX },
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
      subPropertyKey: "top",
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { value: 3.2, unit: Unit.PX },
    })
  })

  it("should compute the optical padding with a theme value", () => {
    const computedValue: ComputedOpticalPaddingValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: { basedOn: "#buttonSize", factor: 2 },
      },
    }

    const properties: Properties = {
      buttonSize: {
        type: ValueType.THEME_ORDINAL,
        value: "@fontSize.small",
      },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
      subPropertyKey: "top",
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { value: 1.749, unit: Unit.REM },
    })
  })

  it("should compute the optical padding on all sides", () => {
    const computedValue: ComputedOpticalPaddingValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: { basedOn: "#lines", factor: 2 },
      },
    }

    const properties: Properties = {
      lines: { type: ValueType.EXACT, value: 10 },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    // Test right padding
    const rightResult = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
      subPropertyKey: "right",
    })
    expect(rightResult).toEqual({
      type: ValueType.EXACT,
      value: 16,
    })

    // Test bottom padding
    const bottomResult = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
      subPropertyKey: "bottom",
    })
    expect(bottomResult).toEqual({
      type: ValueType.EXACT,
      value: 8,
    })

    // Test left padding
    const leftResult = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
      subPropertyKey: "left",
    })
    expect(leftResult).toEqual({
      type: ValueType.EXACT,
      value: 12.8,
    })
  })

  it("should handle default ratio when no subPropertyKey is provided", () => {
    const computedValue: ComputedOpticalPaddingValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: { basedOn: "#lines", factor: 2 },
      },
    }

    const properties: Properties = {
      lines: { type: ValueType.EXACT, value: 10 },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: 12.8,
    })
  })

  it("should handle different factor values correctly", () => {
    const computedValue: ComputedOpticalPaddingValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: { basedOn: "#lines", factor: 1.5 },
      },
    }

    const properties: Properties = {
      lines: { type: ValueType.EXACT, value: 20 },
    }

    const context = {
      properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
      subPropertyKey: "top",
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: 12,
    })
  })

  it("should handle parent context values", () => {
    const computedValue: ComputedOpticalPaddingValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.OPTICAL_PADDING,
        input: { basedOn: "#parent.lines", factor: 2 },
      },
    }

    const parentProperties: Properties = {
      lines: { type: ValueType.EXACT, value: 15 },
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

    const result = computeOpticalPadding(computedValue, context, {
      propertyKey: "padding",
      subPropertyKey: "top",
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: 12,
    })
  })
})
