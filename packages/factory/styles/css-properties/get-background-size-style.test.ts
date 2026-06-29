import { ImageFit, SingleBackgroundSizeValue, Unit, ValueType } from "@seldon/core"
import { describe, expect, it } from "vitest"

import { getBackgroundSizeStyle } from "./get-background-size-style"

describe("getBackgroundSizeStyle", () => {
  it("maps a named fit stored as an exact string", () => {
    expect(
      getBackgroundSizeStyle({
        type: ValueType.EXACT,
        value: ImageFit.COVER,
      } as unknown as SingleBackgroundSizeValue),
    ).toBe("cover")
  })

  it("maps the stretch fit to a 100% 100% size", () => {
    expect(
      getBackgroundSizeStyle({
        type: ValueType.OPTION,
        value: ImageFit.STRETCH,
      } as unknown as SingleBackgroundSizeValue),
    ).toBe("100% 100%")
  })

  it("serializes an exact length size", () => {
    expect(
      getBackgroundSizeStyle({
        type: ValueType.EXACT,
        value: { unit: Unit.PX, value: 40 },
      } as unknown as SingleBackgroundSizeValue),
    ).toBe("40px")
  })

  it("returns an empty string for unsupported value types", () => {
    expect(
      getBackgroundSizeStyle({
        type: ValueType.EMPTY,
        value: null,
      } as unknown as SingleBackgroundSizeValue),
    ).toBe("")
  })
})
