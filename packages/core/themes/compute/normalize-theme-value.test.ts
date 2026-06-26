import { describe, expect, it } from "vitest"

import {
  normalizeThemeExactValue,
  normalizeThemeNumber,
} from "./normalize-theme-value"

describe("normalizeThemeNumber", () => {
  it("returns numbers, extracts unit values, and parses numeric strings", () => {
    expect(normalizeThemeNumber(5)).toBe(5)
    expect(normalizeThemeNumber({ unit: "px", value: 16 })).toBe(16)
    expect(normalizeThemeNumber("12")).toBe(12)
  })

  it("throws when a value cannot be normalized", () => {
    expect(() => normalizeThemeNumber({})).toThrow()
    expect(() => normalizeThemeNumber("abc")).toThrow()
  })
})

describe("normalizeThemeExactValue", () => {
  it("accepts px and rem length objects", () => {
    expect(normalizeThemeExactValue({ unit: "px", value: 16 })).toEqual({
      unit: "px",
      value: 16,
    })
    expect(normalizeThemeExactValue({ unit: "rem", value: 1.5 })).toEqual({
      unit: "rem",
      value: 1.5,
    })
  })

  it("throws on a wrong unit, a non-finite value, or a non-object", () => {
    expect(() => normalizeThemeExactValue({ unit: "em", value: 1 })).toThrow()
    expect(() =>
      normalizeThemeExactValue({ unit: "px", value: Number.NaN }),
    ).toThrow()
    expect(() => normalizeThemeExactValue("16px")).toThrow()
  })
})
