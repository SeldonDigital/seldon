import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "../../../index"
import { HexValue } from "../../../properties/values/color/hex"
import { DegreesValue } from "../../../properties/values/shared/degrees"
import { EmptyValue } from "../../../properties/values/shared/empty"
import { PercentageValue } from "../../../properties/values/shared/percentage"
import { PixelValue } from "../../../properties/values/shared/pixel"
import { RemValue } from "../../../properties/values/shared/rem"
import { isUnitValue } from "./is-unit-value"

describe("isUnitValue", () => {
  it("should return true for valid unit values", () => {
    const unitValues = [
      {
        type: ValueType.EXACT,
        value: { value: 10, unit: Unit.PX },
      } as PixelValue,
      {
        type: ValueType.EXACT,
        value: { value: 1.5, unit: Unit.REM },
      } as RemValue,
      {
        type: ValueType.EXACT,
        value: { value: 50, unit: Unit.PERCENT },
      } as PercentageValue,
      {
        type: ValueType.EXACT,
        value: { value: 45, unit: Unit.DEGREES },
      } as DegreesValue,
      {
        type: ValueType.EXACT,
        value: { value: 0, unit: Unit.PX },
      } as PixelValue,
      {
        type: ValueType.EXACT,
        value: { value: -1.5, unit: Unit.REM },
      } as RemValue,
      {
        type: ValueType.EXACT,
        value: { value: 12.5, unit: Unit.PERCENT },
      } as PercentageValue,
    ]

    unitValues.forEach((value) => {
      expect(isUnitValue(value)).toBe(true)
    })
  })

  it("should return false for non-unit values", () => {
    const nonUnitValues = [
      {
        type: ValueType.EMPTY,
        value: null,
      } as EmptyValue,
      {
        type: ValueType.EXACT,
        value: "#ff0000",
      } as HexValue,
    ]

    nonUnitValues.forEach((value) => {
      expect(isUnitValue(value)).toBe(false)
    })
  })

  it("should narrow types correctly for unit values", () => {
    const pixelValue: PixelValue = {
      type: ValueType.EXACT,
      value: { value: 10, unit: Unit.PX },
    }

    const remValue: RemValue = {
      type: ValueType.EXACT,
      value: { value: 1.5, unit: Unit.REM },
    }

    if (isUnitValue(pixelValue)) {
      expect(pixelValue.value.unit).toBe(Unit.PX)
      expect(pixelValue.value.value).toBe(10)
    }

    if (isUnitValue(remValue)) {
      expect(remValue.value.unit).toBe(Unit.REM)
      expect(remValue.value.value).toBe(1.5)
    }
  })
})
