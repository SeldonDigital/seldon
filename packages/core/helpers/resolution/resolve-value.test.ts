import { describe, expect, it } from "bun:test"
import { ValueType } from "../../index"
import { HexValue } from "../../properties/values/color/hex"
import { EmptyValue } from "../../properties/values/shared/empty"
import { resolveValue } from "./resolve-value"

describe("resolveValue", () => {
  it("should return undefined for undefined input", () => {
    expect(resolveValue(undefined)).toBeUndefined()
  })

  it("should return undefined for empty value", () => {
    const emptyValue: EmptyValue = { type: ValueType.EMPTY, value: null }
    expect(resolveValue(emptyValue)).toBeUndefined()
  })

  it("should return original value for non-empty value", () => {
    const colorValue: HexValue = { type: ValueType.EXACT, value: "#000000" }
    expect(resolveValue(colorValue)).toEqual(colorValue)
  })
})
