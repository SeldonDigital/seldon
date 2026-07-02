import { describe, expect, it } from "vitest"

import { ValueType } from "../../index"
import { isDarkBackgroundColor } from "./contrast"

const hex = (value: string) => ({ type: ValueType.EXACT as const, value })

describe("isDarkBackgroundColor", () => {
  it("classifies dark and light colors", () => {
    expect(isDarkBackgroundColor(hex("#000000"))).toBe(true)
    expect(isDarkBackgroundColor(hex("#ffffff"))).toBe(false)
  })

  it("reads an RGB object color", () => {
    expect(
      isDarkBackgroundColor({
        type: ValueType.EXACT,
        value: { red: 0, green: 0, blue: 0 },
      }),
    ).toBe(true)
  })

  it("throws for empty and transparent colors", () => {
    expect(() =>
      isDarkBackgroundColor({ type: ValueType.EMPTY, value: null }),
    ).toThrow()
    expect(() =>
      isDarkBackgroundColor({ type: ValueType.OPTION, value: "transparent" }),
    ).toThrow()
  })
})
