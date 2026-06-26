import { describe, expect, it } from "vitest"

import { Unit, ValueType } from "../../properties"
import type { Value } from "../../properties/types/value"
import { stringifyValue } from "./stringify-value"

describe("stringifyValue", () => {
  it("returns undefined for empty or missing values", () => {
    expect(stringifyValue(undefined)).toBeUndefined()
    expect(stringifyValue({ type: ValueType.EMPTY, value: null } as Value)).toBeUndefined()
  })

  it("stringifies primitive exact values", () => {
    expect(stringifyValue({ type: ValueType.EXACT, value: 16 } as Value)).toBe("16")
    expect(stringifyValue({ type: ValueType.EXACT, value: "hi" } as Value)).toBe("hi")
    expect(stringifyValue({ type: ValueType.EXACT, value: true } as Value)).toBe("On")
    expect(stringifyValue({ type: ValueType.EXACT, value: false } as Value)).toBe("Off")
  })

  it("stringifies unit-bearing exact values", () => {
    expect(
      stringifyValue({ type: ValueType.EXACT, value: { unit: Unit.PX, value: 8 } } as Value),
    ).toBe("8px")
    expect(
      stringifyValue({ type: ValueType.EXACT, value: { unit: Unit.REM, value: 1.5 } } as Value),
    ).toBe("1.5rem")
    expect(
      stringifyValue({ type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 50 } } as Value),
    ).toBe("50%")
    expect(
      stringifyValue({ type: ValueType.EXACT, value: { unit: Unit.DEGREES, value: 90 } } as Value),
    ).toBe("90°")
  })

  it("returns the raw value for option and theme references", () => {
    expect(stringifyValue({ type: ValueType.OPTION, value: "fit" } as Value)).toBe("fit")
    expect(
      stringifyValue({ type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" } as Value),
    ).toBe("@fontSize.medium")
    expect(stringifyValue({ type: ValueType.INHERIT, value: null } as Value)).toBe("Inherit")
  })

  it("collapses a uniform compound to its common value, else 'Custom'", () => {
    const uniform = {
      top: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 4 } },
      bottom: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 4 } },
    } as unknown as Value
    expect(stringifyValue(uniform)).toBe("4px")

    const mixed = {
      top: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 4 } },
      bottom: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 8 } },
    } as unknown as Value
    expect(stringifyValue(mixed)).toBe("Custom")
  })

  it("labels computed values with a display string", () => {
    const result = stringifyValue({
      type: ValueType.COMPUTED,
      value: "nonexistent-fn",
    } as unknown as Value)
    expect(typeof result).toBe("string")
  })
})
