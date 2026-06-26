import { describe, expect, it } from "vitest"

import { ComputedFunction, ValueType } from "../../../properties/constants"
import type { Value } from "../../../properties/types/value"
import { isAtomicValue } from "./is-atomic-value"
import { isComputedValue, isMatchColorValue } from "./is-computed-value"
import { isDoubleAxisValue } from "./is-double-axis-value"
import { isEmptyValue } from "./is-empty-value"
import { isThemeValue } from "./is-theme-value"
import { isUnitValue } from "./is-unit-value"

const asValue = (value: unknown): Value => value as Value

describe("isAtomicValue", () => {
  it("accepts objects with type and value", () => {
    expect(isAtomicValue(asValue({ type: ValueType.EXACT, value: 5 }))).toBe(
      true,
    )
  })

  it("rejects objects missing type or value", () => {
    expect(isAtomicValue(asValue({ foo: 1 }))).toBe(false)
  })
})

describe("isEmptyValue", () => {
  it("accepts EMPTY values", () => {
    expect(isEmptyValue(asValue({ type: ValueType.EMPTY, value: null }))).toBe(
      true,
    )
  })

  it("rejects non-empty values and undefined", () => {
    expect(isEmptyValue(asValue({ type: ValueType.EXACT, value: 1 }))).toBe(
      false,
    )
    expect(isEmptyValue(undefined)).toBe(false)
  })
})

describe("isThemeValue", () => {
  it("accepts categorical and ordinal theme values", () => {
    expect(
      isThemeValue(
        asValue({
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        }),
      ),
    ).toBe(true)
    expect(
      isThemeValue(
        asValue({ type: ValueType.THEME_ORDINAL, value: "@size.medium" }),
      ),
    ).toBe(true)
  })

  it("rejects exact values", () => {
    expect(isThemeValue(asValue({ type: ValueType.EXACT, value: 1 }))).toBe(
      false,
    )
  })
})

describe("isUnitValue", () => {
  it("accepts exact values carrying a unit object", () => {
    expect(
      isUnitValue(
        asValue({ type: ValueType.EXACT, value: { unit: "px", value: 16 } }),
      ),
    ).toBe(true)
  })

  it("rejects exact values without a unit object", () => {
    expect(isUnitValue(asValue({ type: ValueType.EXACT, value: 5 }))).toBe(
      false,
    )
  })
})

describe("isComputedValue / isMatchColorValue", () => {
  it("detects computed values", () => {
    expect(
      isComputedValue({
        type: ValueType.COMPUTED,
        value: ComputedFunction.MATCH_COLOR,
      }),
    ).toBe(true)
    expect(isComputedValue({ type: ValueType.EXACT, value: 1 })).toBe(false)
  })

  it("narrows to the MATCH_COLOR function only", () => {
    expect(
      isMatchColorValue({
        type: ValueType.COMPUTED,
        value: ComputedFunction.MATCH_COLOR,
      }),
    ).toBe(true)
    expect(
      isMatchColorValue({
        type: ValueType.COMPUTED,
        value: ComputedFunction.AUTO_FIT,
      }),
    ).toBe(false)
  })
})

describe("isDoubleAxisValue", () => {
  it("accepts exactly two valid position values", () => {
    expect(isDoubleAxisValue("10px 20px")).toBe(true)
    expect(isDoubleAxisValue("1rem 50%")).toBe(true)
  })

  it("rejects one, three, or invalid axes", () => {
    expect(isDoubleAxisValue("10px")).toBe(false)
    expect(isDoubleAxisValue("10px 20px 30px")).toBe(false)
    expect(isDoubleAxisValue("10px abc")).toBe(false)
  })
})
