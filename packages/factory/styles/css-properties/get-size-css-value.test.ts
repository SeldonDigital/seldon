import { describe, expect, it } from "vitest"

import { Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getSizeCSSValue } from "./get-size-css-value"

describe("getSizeCSSValue", () => {
  it("serializes an exact pixel size", () => {
    expect(
      getSizeCSSValue({
        size: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 100 } },
        parentContext: null,
        theme: defaultTheme,
      }),
    ).toBe("100px")
  })

  it("returns an empty string for an empty size", () => {
    expect(
      getSizeCSSValue({
        size: { type: ValueType.EMPTY, value: null },
        parentContext: null,
        theme: defaultTheme,
      }),
    ).toBe("")
  })

  it("throws for a non-zero numeric size", () => {
    expect(() =>
      getSizeCSSValue({
        size: {
          type: ValueType.EXACT,
          value: { unit: Unit.NUMBER, value: 5 },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        parentContext: null,
        theme: defaultTheme,
      }),
    ).toThrow(/size can only be 0 or a string/)
  })
})
