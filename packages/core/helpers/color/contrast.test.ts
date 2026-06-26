import { describe, expect, it } from "vitest"

import { ValueType } from "../../index"
import { getContrastRatio, isDarkBackgroundColor } from "./contrast"

const hex = (value: string) => ({ type: ValueType.EXACT as const, value })

describe("getContrastRatio", () => {
  it("returns the full range for black and the minimum for white", () => {
    expect(getContrastRatio(hex("#000000"))).toBeCloseTo(21, 0)
    expect(getContrastRatio(hex("#ffffff"))).toBeCloseTo(1, 0)
  })

  it("reads an RGB object color", () => {
    expect(
      getContrastRatio({
        type: ValueType.EXACT,
        value: { red: 0, green: 0, blue: 0 },
      }),
    ).toBeCloseTo(21, 0)
  })
})

describe("isDarkBackgroundColor", () => {
  it("classifies dark and light colors", () => {
    expect(isDarkBackgroundColor(hex("#000000"))).toBe(true)
    expect(isDarkBackgroundColor(hex("#ffffff"))).toBe(false)
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
