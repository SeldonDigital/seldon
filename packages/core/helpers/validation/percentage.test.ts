import { describe, expect, it } from "vitest"

import { isPercentage } from "./percentage"

describe("isPercentage", () => {
  it("accepts integer and decimal percentages", () => {
    expect(isPercentage("50%")).toBe(true)
    expect(isPercentage("12.5%")).toBe(true)
  })

  it("rejects missing sign and negatives", () => {
    expect(isPercentage("50")).toBe(false)
    expect(isPercentage("-5%")).toBe(false)
    expect(isPercentage("%")).toBe(false)
  })

  it("enforces min and max bounds on the numeric part", () => {
    expect(isPercentage("50%", { min: 0, max: 100 })).toBe(true)
    expect(isPercentage("150%", { max: 100 })).toBe(false)
    expect(isPercentage("5%", { min: 10 })).toBe(false)
  })
})
