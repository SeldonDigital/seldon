import { describe, expect, it } from "bun:test"
import { Resize, Unit, ValueType } from "../../../index"
import { AtomicValue } from "../../../properties/types/value-atomic"
import { CompoundValue } from "../../../properties/types/value-compound"
import { isCompoundValue } from "./is-compound-value"

describe("isCompoundValue", () => {
  it("should return true for compound property values", () => {
    const compoundValues: CompoundValue[] = [
      {
        topRight: { type: ValueType.THEME_ORDINAL, value: "@corners.compact" },
        bottomRight: {
          type: ValueType.THEME_ORDINAL,
          value: "@corners.compact",
        },
        bottomLeft: {
          type: ValueType.THEME_ORDINAL,
          value: "@corners.compact",
        },
        topLeft: { type: ValueType.THEME_ORDINAL, value: "@corners.compact" },
      },
      {
        top: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 10 } },
        right: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 10 } },
        bottom: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 10 } },
        left: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 10 } },
      },
    ]

    compoundValues.forEach((value) => {
      expect(isCompoundValue(value)).toBe(true)
    })
  })

  it("should return false for primitive property values", () => {
    const atomicValues: AtomicValue[] = [
      { type: ValueType.PRESET, value: Resize.FILL },
      { type: ValueType.EXACT, value: "#ff0000" },
      { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      { type: ValueType.EMPTY, value: null },
    ]

    atomicValues.forEach((value) => {
      expect(isCompoundValue(value)).toBe(false)
    })
  })

  it("should return false for invalid values", () => {
    const invalidValues = [null, undefined, "string", 123, true]

    invalidValues.forEach((value) => {
      expect(
        isCompoundValue(value as unknown as CompoundValue | AtomicValue),
      ).toBe(false)
    })
  })

  it("should return true for empty compound values", () => {
    const emptyCompoundValue = {} as CompoundValue
    expect(isCompoundValue(emptyCompoundValue)).toBe(true)
  })
})
