import { describe, expect, it } from "bun:test"
import {
  ComputedAutoFitValue,
  ComputedFunction,
  Properties,
  Unit,
  ValueType,
} from "../index"
import testTheme from "../themes/test/test-theme"
import { computeAutoFit } from "./compute-auto-fit"

describe("computeAutoFit", () => {
  it("should compute auto fit value from EXACT property with REM unit", () => {
    const properties: Properties = {
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 100 },
      },
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#buttonSize",
            factor: 0.8,
          },
        },
      },
    }

    const result = computeAutoFit(properties.size as ComputedAutoFitValue, {
      properties: properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 80 },
    })
  })

  it("should compute auto fit value from THEME_ORDINAL property", () => {
    const properties: Properties = {
      buttonSize: {
        type: ValueType.THEME_ORDINAL,
        value: "@fontSize.small",
      },
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#buttonSize",
            factor: 2,
          },
        },
      },
    }

    const result = computeAutoFit(properties.size as ComputedAutoFitValue, {
      properties: properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 1.749 },
    })
  })

  it("should compute auto fit value from EXACT property with PX unit", () => {
    const properties: Properties = {
      buttonSize: {
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 50 },
      },
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#buttonSize",
            factor: 1.2,
          },
        },
      },
    }

    const result = computeAutoFit(properties.size as ComputedAutoFitValue, {
      properties: properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 60 },
    })
  })

  it("should throw error when basedOn property is not a supported value type", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#color",
            factor: 2,
          },
        },
      },
    }

    expect(() => {
      computeAutoFit(properties.size as ComputedAutoFitValue, {
        properties: properties,
        parentContext: null,
        theme: testTheme,
      })
    }).toThrow("Failed to compute auto fit from")
  })

  it("should handle different factor values correctly", () => {
    const properties: Properties = {
      width: {
        type: ValueType.EXACT,
        value: { unit: Unit.REM, value: 20 },
      },
    }

    const computedValue: ComputedAutoFitValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.AUTO_FIT,
        input: {
          basedOn: "#width",
          factor: 0.5,
        },
      },
    }

    const result = computeAutoFit(computedValue, {
      properties: properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 10 },
    })
  })

  it("should preserve unit type from basedOn property", () => {
    const properties: Properties = {
      height: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 50 },
      },
    }

    const computedValue: ComputedAutoFitValue = {
      type: ValueType.COMPUTED,
      value: {
        function: ComputedFunction.AUTO_FIT,
        input: {
          basedOn: "#height",
          factor: 1.5,
        },
      },
    }

    const result = computeAutoFit(computedValue, {
      properties: properties,
      parentContext: null,
      theme: testTheme,
    })

    expect(result).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PERCENT, value: 75 },
    })
  })
})
