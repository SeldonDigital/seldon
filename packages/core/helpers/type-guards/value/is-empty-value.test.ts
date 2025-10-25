import { describe, expect, it } from "bun:test"
import { ValueType } from "../../../index"
import { EmptyValue } from "../../../properties/values/shared/empty/empty"
import { HexValue } from "../../../properties/values/shared/hex"
import { isEmptyValue } from "./is-empty-value"

describe("isEmptyValue", () => {
  it("should return true for empty values", () => {
    const emptyValue = { type: ValueType.EMPTY, value: null } as EmptyValue
    expect(isEmptyValue(emptyValue)).toBe(true)
  })

  it("should return false for non-empty values", () => {
    const nonEmptyValues = [
      undefined,
      null,
      { type: ValueType.EXACT, value: "#000000" } as HexValue,
      { type: ValueType.PRESET, value: "center" } as unknown,
      {
        type: ValueType.THEME_ORDINAL,
        value: "@fontSize.small",
      } as unknown,
      { type: ValueType.EXACT, value: 123 } as unknown,
      { value: null } as unknown,
      "string" as unknown,
      123 as unknown,
      true as unknown,
      {} as unknown,
      [] as unknown,
    ]

    nonEmptyValues.forEach((value) => {
      expect(isEmptyValue(value)).toBe(false)
    })
  })
})
