import { BackgroundPosition, BackgroundPositionValue, Unit, ValueType } from "@seldon/core"
import { describe, expect, it } from "vitest"

import { getBackgroundPositionStyle } from "./get-background-position-style"

describe("getBackgroundPositionStyle", () => {
  it("serializes a single exact length", () => {
    expect(
      getBackgroundPositionStyle({
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 10 },
      } as unknown as BackgroundPositionValue),
    ).toBe("10px")
  })

  it("serializes a two-axis exact value", () => {
    expect(
      getBackgroundPositionStyle({
        type: ValueType.EXACT,
        value: {
          x: { unit: Unit.PX, value: 10 },
          y: { unit: Unit.PERCENT, value: 50 },
        },
      } as unknown as BackgroundPositionValue),
    ).toBe("10px 50%")
  })

  it("maps an option to its keyword", () => {
    expect(
      getBackgroundPositionStyle({
        type: ValueType.OPTION,
        value: BackgroundPosition.CENTER,
      } as unknown as BackgroundPositionValue),
    ).toBe("center")
  })

  it("returns an empty string for unsupported value types", () => {
    expect(
      getBackgroundPositionStyle({
        type: ValueType.EMPTY,
        value: null,
      } as unknown as BackgroundPositionValue),
    ).toBe("")
  })
})
