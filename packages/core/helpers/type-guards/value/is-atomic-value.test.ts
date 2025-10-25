import { describe, expect, it } from "bun:test"
import { ValueType } from "../../../properties"
import { isAtomicValue } from "./is-atomic-value"

describe("isAtomicValue", () => {
  it("should return true for atomic values", () => {
    const atomicValues = [
      { type: ValueType.EXACT, value: "test" },
      { type: ValueType.PRESET, value: "center" },
      { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      { type: ValueType.EMPTY, value: null },
    ]

    atomicValues.forEach((value) => {
      expect(isAtomicValue(value)).toBe(true)
    })
  })

  it("should return false for compound values", () => {
    const compoundValues = [
      { top: { type: ValueType.EXACT, value: "10px" } },
      {
        color: { type: ValueType.EXACT, value: "#000" },
        size: { type: ValueType.EXACT, value: "16px" },
      },
      {},
    ]

    compoundValues.forEach((value) => {
      expect(isAtomicValue(value)).toBe(false)
    })
  })

  it("should return false for non-object values", () => {
    const nonObjectValues = ["string", 123, true, null, undefined]

    nonObjectValues.forEach((value) => {
      expect(isAtomicValue(value)).toBe(false)
    })
  })
})
