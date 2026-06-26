import { describe, expect, it } from "vitest"

import { round } from "./round"

describe("round", () => {
  it("rounds to 3 decimals by default", () => {
    expect(round(1.23456)).toBe(1.235)
    expect(round(1.2)).toBe(1.2)
  })

  it("respects an explicit precision", () => {
    expect(round(3.14159, 2)).toBe(3.14)
    expect(round(3.14159, 0)).toBe(3)
    expect(round(1.5, 0)).toBe(2)
  })

  it("leaves integers untouched", () => {
    expect(round(42)).toBe(42)
    expect(round(-7, 2)).toBe(-7)
  })
})
