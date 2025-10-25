import { describe, expect, it } from "bun:test"
import { ValueType } from "../../index"
import { EmptyValue } from "../../properties/values/shared/empty/empty"
import { HexValue } from "../../properties/values/shared/hex"
import { resolveValue } from "./resolve-value"

describe("resolveValue", () => {
  it("should return undefined for undefined input", () => {
    const result = resolveValue(undefined)
    expect(result).toBeUndefined()
  })

  it("should return undefined for empty value", () => {
    const emptyValue: EmptyValue = { type: ValueType.EMPTY, value: null }
    const result = resolveValue(emptyValue)
    expect(result).toBeUndefined()
  })

  it("should return original value for non-empty value", () => {
    const colorValue: HexValue = { type: ValueType.EXACT, value: "#000000" }
    const result = resolveValue(colorValue)
    expect(result).toEqual(colorValue)
  })

  it("should return original value for HSL value", () => {
    const hslValue = {
      type: ValueType.EXACT,
      value: { hue: 0, saturation: 100, lightness: 50 },
    }
    const result = resolveValue(hslValue)
    expect(result).toEqual(hslValue)
  })

  it("should return original value for RGB value", () => {
    const rgbValue = {
      type: ValueType.EXACT,
      value: { red: 255, green: 0, blue: 0 },
    }
    const result = resolveValue(rgbValue)
    expect(result).toEqual(rgbValue)
  })
})
