import { describe, expect, it } from "vitest"

import { isNumber } from "./number"

describe("isNumber", () => {
  it("accepts integers and decimals, including negatives", () => {
    expect(isNumber("42")).toBe(true)
    expect(isNumber("-3.5")).toBe(true)
    expect(isNumber("0")).toBe(true)
  })

  it("rejects non-numeric strings and unit suffixes", () => {
    expect(isNumber("")).toBe(false)
    expect(isNumber("abc")).toBe(false)
    expect(isNumber("12px")).toBe(false)
    expect(isNumber("1e3")).toBe(false)
  })

  it("enforces min and max bounds", () => {
    expect(isNumber("5", { min: 1, max: 10 })).toBe(true)
    expect(isNumber("0", { min: 1 })).toBe(false)
    expect(isNumber("11", { max: 10 })).toBe(false)
  })
})
