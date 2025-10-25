import { describe, expect, it } from "bun:test"
import { Value } from "../../properties/types/value"
import { ComputedFunction } from "../../properties/values/shared/computed/computed-functions"
import { Unit } from "../properties"
import { ValueType } from "../properties"
import { stringifyValue } from "./stringify-value"

describe("stringifyValue", () => {
  it("should convert exact values with pixel units", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { value: 10, unit: Unit.PX },
    }
    const result = stringifyValue(value)
    expect(result).toBe("10px")
  })

  it("should convert exact values with rem units", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { value: 1.5, unit: Unit.REM },
    }
    const result = stringifyValue(value)
    expect(result).toBe("1.5rem")
  })

  it("should convert exact values with percent units", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { value: 50, unit: Unit.PERCENT },
    }
    const result = stringifyValue(value)
    expect(result).toBe("50%")
  })

  it("should convert exact values with degree units", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { value: 45, unit: Unit.DEGREES },
    }
    const result = stringifyValue(value)
    expect(result).toBe("45°")
  })

  it("should convert exact values with number units", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { value: 2, unit: Unit.NUMBER },
    }
    const result = stringifyValue(value)
    expect(result).toBe("2")
  })

  it("should convert exact number values", () => {
    const value: Value = { type: ValueType.EXACT, value: 42 }
    const result = stringifyValue(value)
    expect(result).toBe("42")
  })

  it("should convert exact string values", () => {
    const value: Value = { type: ValueType.EXACT, value: "test" }
    const result = stringifyValue(value)
    expect(result).toBe("test")
  })

  it("should convert exact boolean true values", () => {
    const value: Value = { type: ValueType.EXACT, value: true }
    const result = stringifyValue(value)
    expect(result).toBe("On")
  })

  it("should convert exact boolean false values", () => {
    const value: Value = { type: ValueType.EXACT, value: false }
    const result = stringifyValue(value)
    expect(result).toBe("Off")
  })

  it("should convert RGB color objects", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { red: 255, green: 0, blue: 0 },
    }
    const result = stringifyValue(value)
    expect(result).toBe("rgb(255 0 0)")
  })

  it("should convert HSL color objects", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { hue: 180, saturation: 50, lightness: 50 },
    }
    const result = stringifyValue(value)
    expect(result).toBe("hsl(180 50% 50%)")
  })

  it("should convert LCH color objects", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { lightness: 50, chroma: 100, hue: 120 },
    }
    const result = stringifyValue(value)
    expect(result).toBe("lch(50% 100 120deg)")
  })

  it("should convert preset values", () => {
    const value: Value = { type: ValueType.PRESET, value: "stretch" }
    const result = stringifyValue(value)
    expect(result).toBe("stretch")
  })

  it("should convert theme ordinal values", () => {
    const value: Value = {
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    }
    const result = stringifyValue(value)
    expect(result).toBe("@fontSize.medium")
  })

  it("should convert theme categorical values", () => {
    const value: Value = {
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    }
    const result = stringifyValue(value)
    expect(result).toBe("@swatch.primary")
  })

  it("should convert inherit values", () => {
    const value: Value = { type: ValueType.INHERIT, value: null }
    const result = stringifyValue(value)
    expect(result).toBe("Inherit")
  })

  it("should convert computed values", () => {
    const value: Value = {
      type: ValueType.COMPUTED,
      value: { function: ComputedFunction.MATCH, input: { basedOn: "#align" } },
    }
    const result = stringifyValue(value)
    expect(result).toBe("Match")
  })

  it("should handle compound values with identical sub-values", () => {
    const value: Value = {
      top: { type: ValueType.EXACT, value: { value: 10, unit: Unit.PX } },
      bottom: { type: ValueType.EXACT, value: { value: 10, unit: Unit.PX } },
      left: { type: ValueType.EXACT, value: { value: 10, unit: Unit.PX } },
      right: { type: ValueType.EXACT, value: { value: 10, unit: Unit.PX } },
    }
    const result = stringifyValue(value)
    expect(result).toBe("10px")
  })

  it("should handle compound values with different sub-values", () => {
    const value: Value = {
      top: { type: ValueType.EXACT, value: { value: 10, unit: Unit.PX } },
      bottom: { type: ValueType.EXACT, value: { value: 20, unit: Unit.PX } },
    }
    const result = stringifyValue(value)
    expect(result).toBe("Custom")
  })

  it("should return undefined for empty values", () => {
    const value: Value = { type: ValueType.EMPTY, value: null }
    const result = stringifyValue(value)
    expect(result).toBeUndefined()
  })

  it("should return undefined for undefined input", () => {
    const result = stringifyValue(undefined)
    expect(result).toBeUndefined()
  })

  it("should throw error for unknown value types", () => {
    expect(() => {
      stringifyValue({ type: "unknown", value: "unknown" } as any)
    }).toThrow("Unknown value type: unknown")
  })

  it("should throw error for unknown units", () => {
    const value = {
      type: ValueType.EXACT,
      value: { value: 10, unit: "unknown" },
    } as any
    expect(() => {
      stringifyValue(value)
    }).toThrow("Unknown unit: unknown")
  })

  it("should throw error for unstringifiable exact values", () => {
    const value: Value = {
      type: ValueType.EXACT,
      value: { complex: "object" } as any,
    }
    expect(() => {
      stringifyValue(value)
    }).toThrow("Unable to stringify value:")
  })
})
