import { describe, expect, it } from "bun:test"
import { Resize, Unit, ValueType } from "@seldon/core"
import { serializeValue } from "./serialize-value"

describe("serializeValue", () => {
  it('should return null for empty, "none", or "default" values', () => {
    expect(serializeValue("")).toEqual({ type: ValueType.EMPTY, value: null })
    expect(serializeValue("none")).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
    expect(serializeValue("default")).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
  })

  it("should return correct type and value for fit and fill values", () => {
    expect(serializeValue("fit")).toEqual({
      type: ValueType.PRESET,
      value: Resize.FIT,
    })
    expect(serializeValue("fill")).toEqual({
      type: ValueType.PRESET,
      value: Resize.FILL,
    })
  })

  // Assuming isThemeValue, isHSLString, isHex, isPx, isRem, isNumber are available in the same scope
  it("should return correct type and value for theme value", () => {
    expect(serializeValue("@font.title")).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@font.title",
    })
  })

  it("should return correct type and value for px value", () => {
    expect(serializeValue("10px")).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 10 },
    })
  })

  it("should return correct type and value for rem value", () => {
    expect(serializeValue("2rem")).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 2 },
    })
  })

  it("should return correct type and value for rem value", () => {
    expect(serializeValue("20%")).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PERCENT, value: 20 },
    })
  })

  it("should default to the correct unit when no current value is provided", () => {
    expect(serializeValue("2", { defaultUnit: Unit.PX })).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 2 },
    })
  })

  it("should default to the correct unit when a current value is provided", () => {
    expect(
      serializeValue("2", {
        currentValue: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 10 },
        },
        defaultUnit: Unit.PX,
      }),
    ).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 2 },
    })
  })

  it("should default to the correct unit when the current value is not an exact value", () => {
    expect(
      serializeValue("200", {
        currentValue: {
          type: ValueType.PRESET,
          value: Resize.FIT,
        },
        defaultUnit: Unit.PX,
      }),
    ).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 200 },
    })
  })

  it("should return correct type and value for corner preset values", () => {
    expect(serializeValue("rounded")).toEqual({
      type: ValueType.PRESET,
      value: "rounded",
    })
    expect(serializeValue("squared")).toEqual({
      type: ValueType.PRESET,
      value: "squared",
    })
  })

  it("should handle unknown value type as exact value", () => {
    expect(serializeValue("unknown")).toEqual({
      type: ValueType.EXACT,
      value: "unknown",
    })
  })
})
